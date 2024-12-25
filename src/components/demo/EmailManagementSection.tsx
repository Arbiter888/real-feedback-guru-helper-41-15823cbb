import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailCompositionForm } from "./email/EmailCompositionForm";
import { EmailDatabaseTable } from "./email/EmailDatabaseTable";

interface RestaurantInfo {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
  preferredBookingMethod: 'phone' | 'website';
}

interface EmailManagementSectionProps {
  restaurantInfo: RestaurantInfo;
}

export const EmailManagementSection = ({ restaurantInfo }: EmailManagementSectionProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { data: emailContacts, isLoading } = useQuery({
    queryKey: ["emailContacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (params: { subject: string; content: string }) => {
      const { data: lists } = await supabase
        .from("email_lists")
        .select("id")
        .limit(1);

      if (!lists?.length) {
        throw new Error("No email list found");
      }

      const response = await supabase.functions.invoke("send-bulk-email", {
        body: {
          listId: lists[0].id,
          subject: params.subject,
          htmlContent: params.content,
          restaurantInfo: restaurantInfo, // Pass restaurant info to the email function
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Emails sent successfully",
        description: `${data.successCount} emails sent. ${data.errorCount} failed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send emails",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    if (!emailContacts?.length) {
      toast({
        title: "No emails to export",
        description: "Your email database is currently empty.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const headers = ["Email", "First Name", "Last Name", "Created At"];
      const csvContent = [
        headers.join(","),
        ...emailContacts.map((contact) =>
          [
            contact.email,
            contact.first_name || "",
            contact.last_name || "",
            new Date(contact.created_at).toLocaleDateString(),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `email_database_${new Date().toISOString()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Your email database has been exported successfully.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your email database.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async (subject: string, content: string) => {
    await sendEmailMutation.mutateAsync({ subject, content });
  };

  return (
    <div className="space-y-8">
      {/* Email Composition Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Send Email Campaign</h2>
        <EmailCompositionForm
          onSend={handleSendEmail}
          disabled={!emailContacts?.length}
          restaurantInfo={restaurantInfo}
        />
      </div>

      {/* Email Database Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading email database...</div>
        ) : (
          <EmailDatabaseTable
            contacts={emailContacts || []}
            onExport={handleExport}
            isExporting={isExporting}
          />
        )}
      </div>
    </div>
  );
};
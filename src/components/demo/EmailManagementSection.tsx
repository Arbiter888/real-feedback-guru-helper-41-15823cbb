import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const EmailManagementSection = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);

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
    mutationFn: async () => {
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
          subject: emailSubject,
          htmlContent: emailContent,
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
      setEmailSubject("");
      setEmailContent("");
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
      // Convert data to CSV format
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

      // Create and download the CSV file
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

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and content for the email.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await sendEmailMutation.mutateAsync();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Composition Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Send Email Campaign</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="emailSubject">Email Subject</Label>
            <Input
              id="emailSubject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          <div>
            <Label htmlFor="emailContent">Email Content (HTML)</Label>
            <Textarea
              id="emailContent"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter your email content (HTML supported)"
              className="min-h-[200px] font-mono"
            />
          </div>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !emailContacts?.length}
            className="w-full"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Email Campaign"
            )}
          </Button>
        </div>
      </div>

      {/* Email Database Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Email Database</h2>
          <Button
            onClick={handleExport}
            disabled={isExporting || !emailContacts?.length}
          >
            {isExporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading email database...</div>
        ) : !emailContacts?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No emails in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.first_name || "-"}</TableCell>
                    <TableCell>{contact.last_name || "-"}</TableCell>
                    <TableCell>
                      {new Date(contact.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};
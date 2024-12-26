import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerList } from "./CustomerList";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

interface CustomerCRMSectionProps {
  restaurantInfo: RestaurantInfo;
}

export const CustomerCRMSection = ({ restaurantInfo }: CustomerCRMSectionProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: emailContacts, error: emailError } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (emailError) throw emailError;
      return emailContacts;
    },
  });

  const handleGenerateFollowUp = async (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    if (!customer?.metadata?.initial_review) {
      toast({
        title: "Cannot generate follow-up",
        description: "No review data available for this customer.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { 
          reviewText: customer.metadata.initial_review,
          customerName: `${customer.firstName} ${customer.lastName}`,
          receiptData: customer.metadata.receipt_data,
          serverName: customer.metadata.server_name
        },
      });

      if (error) throw error;

      toast({
        title: "Follow-up email generated",
        description: "The follow-up email has been scheduled.",
      });
    } catch (error) {
      console.error("Error generating follow-up:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate follow-up email.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Customer Database</h2>
            <p className="text-sm text-muted-foreground">
              View customer history and generate personalized follow-ups
            </p>
          </div>
        </div>

        <CustomerList
          customers={customers || []}
          isLoading={isLoading}
          onSelectCustomer={setSelectedCustomerId}
          selectedCustomerId={selectedCustomerId}
          onGenerateFollowUp={handleGenerateFollowUp}
        />
      </div>
    </Card>
  );
};
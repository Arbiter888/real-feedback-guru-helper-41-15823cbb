import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { CustomerList } from "./CustomerList";
import { EmailPreviewCard } from "../email/EmailPreviewCard";
import { Customer, CustomerMetadata } from "@/types/customer";

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
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: emailContacts, error: emailError } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (emailError) throw emailError;
      return emailContacts as Customer[];
    },
  });

  const handleGenerateFollowUp = async (customerId: string, voucherDetails?: any) => {
    const customer = customers?.find(c => c.id === customerId);
    if (!customer) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { 
          customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
          voucherDetails,
          restaurantInfo: {
            restaurantName: restaurantInfo.restaurantName,
            websiteUrl: restaurantInfo.websiteUrl,
            facebookUrl: restaurantInfo.facebookUrl,
            instagramUrl: restaurantInfo.instagramUrl,
            phoneNumber: restaurantInfo.phoneNumber,
            googleMapsUrl: restaurantInfo.googleMapsUrl,
          },
          // Only include review data if available and metadata is of type CustomerMetadata
          ...((typeof customer.metadata === 'object' && customer.metadata !== null && 'initial_review' in customer.metadata) && {
            reviewText: (customer.metadata as CustomerMetadata).initial_review,
            refinedReview: (customer.metadata as CustomerMetadata).refined_review,
            receiptData: (customer.metadata as CustomerMetadata).receipt_data,
            serverName: (customer.metadata as CustomerMetadata).server_name,
          })
        },
      });

      if (error) throw error;
      
      setGeneratedEmail(data);
      toast({
        title: "Email generated",
        description: "The thank you email has been generated.",
      });
    } catch (error) {
      console.error("Error generating follow-up:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate thank you email.",
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
              View customer history and generate personalized thank you emails
            </p>
          </div>
        </div>

        {generatedEmail && (
          <EmailPreviewCard
            email={generatedEmail}
            onSendEmail={() => {
              toast({
                title: "Email scheduled",
                description: "The thank you email has been scheduled to be sent.",
              });
              setGeneratedEmail(null);
            }}
            restaurantInfo={restaurantInfo}
          />
        )}

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
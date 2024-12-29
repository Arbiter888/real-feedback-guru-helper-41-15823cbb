import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CustomerList } from "./CustomerList";
import { EmailPreviewCard } from "../email/EmailPreviewCard";
import { Customer, CustomerMetadata } from "@/types/customer";
import { isCustomerMetadata } from "@/types/customer";

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
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: emailContacts, error: emailError } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (emailError) throw emailError;

      return emailContacts?.map((contact: any) => {
        let metadata: CustomerMetadata = {};
        
        if (contact.metadata) {
          metadata = {
            ...contact.metadata,
            receipt_data: contact.metadata.receipt_data || contact.metadata.receipt_analysis
          };
        }

        return {
          ...contact,
          metadata
        };
      }) as Customer[];
    },
  });

  const handleGenerateFollowUp = async (customerId: string, voucherDetails?: any) => {
    const customer = customers?.find(c => c.id === customerId);
    if (!customer) return;
    
    try {
      if (!isCustomerMetadata(customer.metadata)) {
        throw new Error("Invalid metadata format");
      }

      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { 
          customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
          voucherDetails,
          restaurantInfo,
          ...(customer.metadata && {
            reviewText: customer.metadata.initial_review,
            // @ts-ignore
            refinedReview: customer.metadata.refined_review,
            // @ts-ignore
            receiptData: customer.metadata.receipt_data || customer.metadata.receipt_analysis,
            // @ts-ignore
            serverName: customer.metadata.server_name,
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
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Customer Database</h2>
            <p className="text-sm text-muted-foreground">
              View customer history and generate personalized thank you emails
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="px-6 pb-6">
          <CustomerList
            customers={customers || []}
            isLoading={isLoading}
            onSelectCustomer={setSelectedCustomerId}
            selectedCustomerId={selectedCustomerId}
            onGenerateFollowUp={handleGenerateFollowUp}
            restaurantInfo={restaurantInfo}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
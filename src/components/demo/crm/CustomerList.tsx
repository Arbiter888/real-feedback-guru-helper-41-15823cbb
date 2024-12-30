import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CustomerActions } from "./actions/CustomerActions";
import { VoucherSuggestionCard } from "./vouchers/VoucherSuggestionCard";
import { CustomerReviewDetails } from "./reviews/CustomerReviewDetails";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EmailPreviewCard } from "../email/EmailPreviewCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerEmailDialog } from "./email/CustomerEmailDialog";
import { Customer, CustomerMetadata, isCustomerMetadata } from "@/types/customer";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
  onGenerateFollowUp: (customerId: string, voucherDetails?: any) => void;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
  selectedCustomerId,
  onGenerateFollowUp,
  restaurantInfo
}: CustomerListProps) => {
  const [voucherSuggestions, setVoucherSuggestions] = useState<Record<string, any>>({});
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [generatingEmailFor, setGeneratingEmailFor] = useState<string | null>(null);
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, any>>({});
  const [sendingEmailFor, setSendingEmailFor] = useState<string | null>(null);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [selectedEmailData, setSelectedEmailData] = useState<any>(null);
  const [displayCount, setDisplayCount] = useState(5);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const toggleCustomer = (customerId: string) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedCustomers(newExpanded);
  };

  const handleGenerateEmail = async (customerId: string, voucherDetails?: any) => {
    setGeneratingEmailFor(customerId);
    try {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const metadata = isCustomerMetadata(customer.metadata) ? customer.metadata : null;

      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { 
          customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
          reviewText: metadata?.initial_review,
          refinedReview: metadata?.refined_review,
          receiptData: metadata?.receipt_data,
          serverName: metadata?.server_name,
          voucherDetails,
          restaurantInfo
        },
      });

      if (error) throw error;

      setGeneratedEmails(prev => ({
        ...prev,
        [customerId]: {
          email: customer.email,
          email_subject: data.email_subject,
          email_content: data.email_content,
          voucher_details: data.voucher_details
        }
      }));

      setExpandedCustomers(prev => new Set(prev).add(customerId));

      toast({
        title: "Email generated",
        description: "Thank you email has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating email:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate thank you email.",
        variant: "destructive",
      });
    } finally {
      setGeneratingEmailFor(null);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const displayedCustomers = customers.slice(0, displayCount);
  const hasMoreCustomers = displayCount < customers.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedCustomers.map((customer) => {
        const metadata = isCustomerMetadata(customer.metadata) ? customer.metadata : null;
        const suggestion = voucherSuggestions[customer.id];
        const isExpanded = expandedCustomers.has(customer.id);
        const isGeneratingEmail = generatingEmailFor === customer.id;
        const generatedEmail = generatedEmails[customer.id];
        
        return (
          <Card key={customer.id} className="p-6">
            <Collapsible open={isExpanded} onOpenChange={() => toggleCustomer(customer.id)}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <CollapsibleTrigger className="hover:bg-accent p-1 rounded-md">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </CollapsibleTrigger>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {customer.first_name && customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`
                            : customer.email}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(customer.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <VoucherSuggestionCard
                      customer={customer}
                      onVoucherGenerated={(voucher) => {
                        setVoucherSuggestions(prev => ({
                          ...prev,
                          [customer.id]: voucher
                        }));
                      }}
                    />
                    <CustomerActions
                      onGenerateEmail={() => handleGenerateEmail(customer.id, voucherSuggestions[customer.id])}
                      isGeneratingEmail={isGeneratingEmail}
                      voucherSuggestion={suggestion}
                    />
                  </div>
                </div>

                <CollapsibleContent className="space-y-4">
                  <CustomerReviewDetails metadata={metadata} />
                  
                  {generatedEmail && (
                    <div className="mt-4">
                      <EmailPreviewCard
                        email={generatedEmail}
                        onSendEmail={() => {
                          setSelectedEmailData(generatedEmail);
                          setShowSendConfirm(true);
                        }}
                        restaurantInfo={restaurantInfo}
                        recipientEmail={customer.email}
                        allowEdit={true}
                      />
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          </Card>
        );
      })}

      {hasMoreCustomers && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="w-full max-w-md"
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            Load More
          </Button>
        </div>
      )}

      <CustomerEmailDialog
        isOpen={showSendConfirm}
        onOpenChange={setShowSendConfirm}
        selectedEmailData={selectedEmailData}
        onSendEmail={handleSendEmail}
        customer={customers.find(c => c.email === selectedEmailData?.email) || null}
        sendingEmailFor={sendingEmailFor}
      />

      {customers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No customers found</p>
        </div>
      )}
    </div>
  );
};
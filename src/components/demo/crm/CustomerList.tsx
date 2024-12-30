import { Button } from "@/components/ui/button";
import { Mail, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Customer, CustomerMetadata } from "@/types/customer";
import { VoucherSuggestionCard } from "./vouchers/VoucherSuggestionCard";
import { CustomerReviewDetails } from "./reviews/CustomerReviewDetails";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EmailPreviewCard } from "../email/EmailPreviewCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CustomerEmailDialog } from "./email/CustomerEmailDialog";

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

  const getMetadata = (customer: Customer): CustomerMetadata => {
    if (typeof customer.metadata === 'object' && customer.metadata !== null) {
      return customer.metadata as CustomerMetadata;
    }
    return {};
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
      await onGenerateFollowUp(customerId, voucherDetails);
      setExpandedCustomers(prev => new Set(prev).add(customerId));
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setGeneratedEmails(prev => ({
          ...prev,
          [customerId]: {
            email: customer.email,
            subject: `Thank you for visiting ${restaurantInfo.restaurantName}!`,
            content: "Generated email content...",
          }
        }));
      }
    } finally {
      setGeneratingEmailFor(null);
    }
  };

  const handleSendEmail = async (customer: Customer, emailData: any) => {
    setSendingEmailFor(customer.id);
    try {
      const { error } = await supabase.functions.invoke("send-customer-email", {
        body: {
          to: customer.email,
          subject: emailData.email_subject,
          htmlContent: emailData.email_content,
          restaurantInfo
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent successfully",
        description: `Thank you email sent to ${customer.email}`,
      });

      setGeneratedEmails(prev => {
        const newEmails = { ...prev };
        delete newEmails[customer.id];
        return newEmails;
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmailFor(null);
      setShowSendConfirm(false);
      setSelectedEmailData(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => {
        const metadata = getMetadata(customer);
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
                    <Button
                      onClick={() => handleGenerateEmail(customer.id, voucherSuggestions[customer.id])}
                      variant="default"
                      size="sm"
                      disabled={!suggestion || isGeneratingEmail}
                    >
                      {isGeneratingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Generate Thank You Email
                        </>
                      )}
                    </Button>
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
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CustomerActions } from "../actions/CustomerActions";
import { VoucherSuggestionCard } from "../vouchers/VoucherSuggestionCard";
import { CustomerReviewDetails } from "../reviews/CustomerReviewDetails";
import { EmailPreviewCard } from "../../email/EmailPreviewCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Customer, isCustomerMetadata } from "@/types/customer";

interface CustomerCardProps {
  customer: Customer;
  isExpanded: boolean;
  onToggle: () => void;
  onGenerateEmail: (customerId: string, voucherDetails?: any) => void;
  isGeneratingEmail: boolean;
  generatedEmail: any;
  voucherSuggestions: Record<string, any>;
  setVoucherSuggestions: (suggestions: Record<string, any>) => void;
  onSendEmail: (emailData: any) => void;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
  formatDate: (date: string) => string;
}

export const CustomerCard = ({
  customer,
  isExpanded,
  onToggle,
  onGenerateEmail,
  isGeneratingEmail,
  generatedEmail,
  voucherSuggestions,
  setVoucherSuggestions,
  onSendEmail,
  restaurantInfo,
  formatDate,
}: CustomerCardProps) => {
  const metadata = isCustomerMetadata(customer.metadata) ? customer.metadata : null;
  const suggestion = voucherSuggestions[customer.id];
  const [isEditingVoucher, setIsEditingVoucher] = useState(false);

  const handleGenerateEmailClick = () => {
    onGenerateEmail(customer.id, voucherSuggestions[customer.id]);
  };

  return (
    <Card className="p-6">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
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
              {!suggestion && (
                <VoucherSuggestionCard
                  customer={customer}
                  onVoucherGenerated={(voucher) => {
                    setVoucherSuggestions(prev => ({
                      ...prev,
                      [customer.id]: voucher
                    }));
                  }}
                />
              )}
              <CustomerActions
                onGenerateEmail={handleGenerateEmailClick}
                isGeneratingEmail={isGeneratingEmail}
                voucherSuggestion={suggestion}
                onEditVoucher={() => setIsEditingVoucher(true)}
              />
            </div>
          </div>

          <CollapsibleContent className="space-y-4">
            <CustomerReviewDetails metadata={metadata} />
            
            {generatedEmail && (
              <div className="mt-4">
                <EmailPreviewCard
                  email={generatedEmail}
                  onSendEmail={() => onSendEmail(generatedEmail)}
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
};
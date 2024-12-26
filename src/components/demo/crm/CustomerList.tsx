import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Customer, CustomerMetadata } from "@/types/customer";
import { VoucherSuggestionCard } from "./vouchers/VoucherSuggestionCard";
import { CustomerReviewDetails } from "./reviews/CustomerReviewDetails";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
  onGenerateFollowUp: (customerId: string, voucherDetails?: any) => void;
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
  selectedCustomerId,
  onGenerateFollowUp
}: CustomerListProps) => {
  const [voucherSuggestions, setVoucherSuggestions] = useState<Record<string, any>>({});

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
        
        return (
          <Card key={customer.id} className="p-6">
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex justify-between items-start">
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
                    onClick={() => onGenerateFollowUp(customer.id, voucherSuggestions[customer.id])}
                    variant="default"
                    size="sm"
                    disabled={!suggestion}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Generate Thank You Email
                  </Button>
                </div>
              </div>

              {/* Review Details */}
              <CustomerReviewDetails metadata={metadata} />
            </div>
          </Card>
        );
      })}

      {customers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No customers found</p>
        </div>
      )}
    </div>
  );
};
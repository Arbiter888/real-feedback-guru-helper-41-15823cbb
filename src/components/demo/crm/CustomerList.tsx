import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Mail, Star, Loader2, MessageSquare, Receipt, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepProgressDisplay } from "./StepProgressDisplay";

interface CustomerListProps {
  customers: any[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
  onGenerateFollowUp: (customerId: string) => void;
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
  selectedCustomerId,
  onGenerateFollowUp
}: CustomerListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="p-6">
          <div className="space-y-6">
            {/* Customer Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {customer.firstName && customer.lastName
                      ? `${customer.firstName} ${customer.lastName}`
                      : customer.email}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
              <Button
                onClick={() => onGenerateFollowUp(customer.id)}
                variant="default"
                size="sm"
              >
                <Mail className="mr-2 h-4 w-4" />
                Generate Follow-up
              </Button>
            </div>

            {/* Review Details */}
            {customer.metadata?.initial_review && (
              <div className="grid gap-4">
                {/* Initial Review */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Initial Review</h4>
                  </div>
                  <p className="text-sm">{customer.metadata.initial_review}</p>
                </div>

                {/* Receipt Data */}
                {customer.metadata.receipt_data && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Receipt Details</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Total Amount: ${customer.metadata.receipt_data.total_amount.toFixed(2)}
                      </p>
                      <div className="space-y-1">
                        {customer.metadata.receipt_data.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm flex justify-between">
                            <span>{item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Review */}
                {customer.metadata.refined_review && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Enhanced Review</h4>
                    </div>
                    <p className="text-sm">{customer.metadata.refined_review}</p>
                  </div>
                )}

                {/* Progress Steps */}
                <StepProgressDisplay 
                  steps={customer.metadata.review_steps_completed || {
                    initial_thoughts: false,
                    receipt_uploaded: false,
                    review_enhanced: false,
                    copied_to_google: false
                  }}
                  timestamps={{
                    initial_thoughts: customer.metadata.review_steps_completed?.initial_thoughts_at,
                    receipt_uploaded: customer.metadata.review_steps_completed?.receipt_uploaded_at,
                    review_enhanced: customer.metadata.review_steps_completed?.review_enhanced_at,
                    review_copied: customer.metadata.review_steps_completed?.copied_to_google_at
                  }}
                />
              </div>
            )}
          </div>
        </Card>
      ))}

      {customers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No customers found</p>
        </div>
      )}
    </div>
  );
};
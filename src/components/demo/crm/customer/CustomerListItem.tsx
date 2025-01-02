import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import { Customer } from "@/types/customer";
import { CustomerMetadataDisplay } from "./CustomerMetadataDisplay";
import { formatDistanceToNow } from "date-fns";

interface CustomerListItemProps {
  customer: Customer;
  onGenerateEmail: (customerId: string) => void;
  isGeneratingEmail: boolean;
}

export const CustomerListItem = ({
  customer,
  onGenerateEmail,
  isGeneratingEmail,
}: CustomerListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {customer.first_name && customer.last_name
                  ? `${customer.first_name} ${customer.last_name}`
                  : customer.email}
              </h3>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <Button
            onClick={() => onGenerateEmail(customer.id)}
            variant="default"
            size="sm"
            disabled={isGeneratingEmail}
          >
            <Mail className="mr-2 h-4 w-4" />
            Generate Email
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>Customer Details</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>

        {isExpanded && customer.metadata && (
          <CustomerMetadataDisplay metadata={customer.metadata} />
        )}
      </div>
    </Card>
  );
};
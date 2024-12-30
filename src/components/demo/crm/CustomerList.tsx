import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CustomerEmailDialog } from "./email/CustomerEmailDialog";
import { Customer } from "@/types/customer";
import { LoadingSpinner } from "./loading/LoadingSpinner";
import { CustomerCard } from "./cards/CustomerCard";

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
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [selectedEmailData, setSelectedEmailData] = useState<any>(null);
  const [displayCount, setDisplayCount] = useState(5);

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
      await onGenerateFollowUp(customerId, voucherDetails);
      setExpandedCustomers(prev => new Set(prev).add(customerId));
    } finally {
      setGeneratingEmailFor(null);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 5);
  };

  const handleSendEmail = (emailData: any) => {
    setSelectedEmailData(emailData);
    setShowSendConfirm(false);
  };

  const displayedCustomers = customers.slice(0, displayCount);
  const hasMoreCustomers = displayCount < customers.length;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {displayedCustomers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isExpanded={expandedCustomers.has(customer.id)}
          onToggle={() => toggleCustomer(customer.id)}
          onGenerateEmail={handleGenerateEmail}
          isGeneratingEmail={generatingEmailFor === customer.id}
          generatedEmail={generatedEmails[customer.id]}
          voucherSuggestions={voucherSuggestions}
          setVoucherSuggestions={setVoucherSuggestions}
          onSendEmail={(emailData) => {
            setSelectedEmailData(emailData);
            setShowSendConfirm(true);
          }}
          restaurantInfo={restaurantInfo}
          formatDate={formatDate}
        />
      ))}

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
        sendingEmailFor={generatingEmailFor}
      />

      {customers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No customers found</p>
        </div>
      )}
    </div>
  );
};
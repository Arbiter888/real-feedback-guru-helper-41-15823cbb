import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { CustomerListItem } from "./customer/CustomerListItem";
import { LoadMoreButton } from "./components/LoadMoreButton";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
  onGenerateFollowUp: (customerId: string) => void;
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
  restaurantInfo,
}: CustomerListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading customers...
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No customers found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <CustomerListItem
          key={customer.id}
          customer={customer}
          onGenerateEmail={() => onGenerateFollowUp(customer.id)}
          isGeneratingEmail={selectedCustomerId === customer.id}
        />
      ))}
    </div>
  );
};
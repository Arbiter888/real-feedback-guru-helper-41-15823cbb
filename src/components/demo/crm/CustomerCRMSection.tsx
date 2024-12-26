import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerList } from "./CustomerList";
import { CustomerDetails } from "./CustomerDetails";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isReceiptData } from "@/types/email";

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

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: emailContacts, error: emailError } = await supabase
        .from("email_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (emailError) throw emailError;

      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Combine and deduplicate customer data
      const combinedCustomers = new Map();

      emailContacts?.forEach(contact => {
        combinedCustomers.set(contact.email, {
          id: contact.id,
          email: contact.email,
          firstName: contact.first_name,
          lastName: contact.last_name,
          createdAt: contact.created_at,
          metadata: contact.metadata,
          type: 'email_contact'
        });
      });

      reviews?.forEach(review => {
        if (review.receipt_data && isReceiptData(review.receipt_data) && review.receipt_data.customer_email) {
          const email = review.receipt_data.customer_email;
          const existing = combinedCustomers.get(email);
          if (existing) {
            existing.reviews = [...(existing.reviews || []), review];
          } else {
            combinedCustomers.set(email, {
              id: review.id,
              email,
              reviews: [review],
              createdAt: review.created_at,
              type: 'reviewer'
            });
          }
        }
      });

      return Array.from(combinedCustomers.values());
    },
  });

  return (
    <Card className="p-6">
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Customer List</TabsTrigger>
          {selectedCustomerId && (
            <TabsTrigger value="details">Customer Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">
          <CustomerList
            customers={customers || []}
            isLoading={isLoading}
            onSelectCustomer={setSelectedCustomerId}
            selectedCustomerId={selectedCustomerId}
          />
        </TabsContent>

        <TabsContent value="details">
          {selectedCustomerId && (
            <CustomerDetails
              customer={customers?.find(c => c.id === selectedCustomerId)}
              restaurantInfo={restaurantInfo}
            />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
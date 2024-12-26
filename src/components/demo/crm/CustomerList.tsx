import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Mail, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerListProps {
  customers: any[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
  selectedCustomerId
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
      <h2 className="text-xl font-semibold">Customer Database</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                {customer.type === 'email_contact' ? (
                  <Mail className="h-4 w-4 text-primary" />
                ) : (
                  <Star className="h-4 w-4 text-primary" />
                )}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.firstName && customer.lastName
                  ? `${customer.firstName} ${customer.lastName}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(customer.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectCustomer(customer.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
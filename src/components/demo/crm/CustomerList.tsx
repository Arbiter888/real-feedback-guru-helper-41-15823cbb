import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, Mail, Loader2, MessageSquare, Receipt, Bot, Gift } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Customer, CustomerMetadata } from "@/types/customer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerListProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (id: string) => void;
  selectedCustomerId: string | null;
  onGenerateFollowUp: (customerId: string, voucherDetails?: any) => void;
}

interface VoucherSuggestion {
  title: string;
  description: string;
  validDays: number;
  discountValue: string;
}

export const CustomerList = ({
  customers,
  isLoading,
  onSelectCustomer,
  selectedCustomerId,
  onGenerateFollowUp
}: CustomerListProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [voucherSuggestions, setVoucherSuggestions] = useState<Record<string, VoucherSuggestion>>({});
  const [editingVoucher, setEditingVoucher] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleVoucherEdit = (customerId: string, field: keyof VoucherSuggestion, value: string | number) => {
    setVoucherSuggestions(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value
      }
    }));
  };

  const generateVoucherSuggestion = async (customer: Customer) => {
    try {
      const metadata = getMetadata(customer);
      const { data: suggestion } = await supabase.functions.invoke('suggest-voucher', {
        body: { 
          reviewText: metadata.initial_review,
          refinedReview: metadata.refined_review,
          receiptData: metadata.receipt_data,
          customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
        }
      });

      setVoucherSuggestions(prev => ({
        ...prev,
        [customer.id]: suggestion
      }));
    } catch (error) {
      console.error('Error generating voucher suggestion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      {customers.map((customer) => {
        const metadata = getMetadata(customer);
        const suggestion = voucherSuggestions[customer.id];
        const isEditing = editingVoucher[customer.id];
        
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
                  {!suggestion && (
                    <Button
                      onClick={() => generateVoucherSuggestion(customer)}
                      variant="outline"
                      size="sm"
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Suggest Voucher
                    </Button>
                  )}
                  <Button
                    onClick={() => onGenerateFollowUp(customer.id, suggestion)}
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
              {metadata.initial_review && (
                <div className="grid gap-4">
                  {/* Initial Review */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Initial Review</h4>
                    </div>
                    <p className="text-sm">{metadata.initial_review}</p>
                  </div>

                  {/* Receipt Data */}
                  {metadata.receipt_data && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">Receipt Details</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Total Amount: ${metadata.receipt_data.total_amount.toFixed(2)}
                        </p>
                        <div className="space-y-1">
                          {metadata.receipt_data.items.map((item, index) => (
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
                  {metadata.refined_review && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">Enhanced Review</h4>
                      </div>
                      <p className="text-sm">{metadata.refined_review}</p>
                    </div>
                  )}

                  {/* Voucher Suggestion */}
                  {suggestion && (
                    <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">Recommended Voucher</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingVoucher(prev => ({
                            ...prev,
                            [customer.id]: !prev[customer.id]
                          }))}
                        >
                          {isEditing ? "Save" : "Edit"}
                        </Button>
                      </div>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={suggestion.title}
                              onChange={(e) => handleVoucherEdit(customer.id, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={suggestion.description}
                              onChange={(e) => handleVoucherEdit(customer.id, 'description', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Discount Value</Label>
                            <Input
                              value={suggestion.discountValue}
                              onChange={(e) => handleVoucherEdit(customer.id, 'discountValue', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Valid Days</Label>
                            <Input
                              type="number"
                              value={suggestion.validDays}
                              onChange={(e) => handleVoucherEdit(customer.id, 'validDays', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-lg font-medium">{suggestion.title}</p>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                          <p className="text-sm">Valid for: {suggestion.validDays} days</p>
                          <p className="text-sm font-medium">Discount: {suggestion.discountValue}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
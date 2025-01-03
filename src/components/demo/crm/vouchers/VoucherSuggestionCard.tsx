import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";

interface VoucherSuggestion {
  title: string;
  description: string;
  validDays: number;
  discountValue: string;
}

interface VoucherSuggestionCardProps {
  customer: Customer;
  onVoucherGenerated: (voucher: VoucherSuggestion) => void;
}

export const VoucherSuggestionCard = ({ customer, onVoucherGenerated }: VoucherSuggestionCardProps) => {
  const [suggestion, setSuggestion] = useState<VoucherSuggestion | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateVoucherSuggestion = async () => {
    try {
      setIsLoading(true);
      const metadata = customer.metadata as any;
      
      // Validate that we have review data before making the request
      if (!metadata?.initial_review) {
        toast({
          title: "Missing review data",
          description: "Cannot generate voucher suggestion without review data.",
          variant: "destructive",
        });
        return;
      }

      console.log('Generating voucher with data:', {
        reviewText: metadata.initial_review,
        refinedReview: metadata.refined_review,
        receiptData: metadata.receipt_data,
        customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
      });

      const { data: suggestionData, error } = await supabase.functions.invoke('suggest-voucher', {
        body: { 
          reviewText: metadata.initial_review,
          refinedReview: metadata.refined_review,
          receiptData: metadata.receipt_data,
          customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
        }
      });

      if (error) throw error;

      console.log('Received suggestion:', suggestionData);
      setSuggestion(suggestionData);
      onVoucherGenerated(suggestionData);
      
      toast({
        title: "Voucher suggestion generated",
        description: "A personalized voucher has been created based on the customer's review.",
      });
    } catch (error: any) {
      console.error('Error generating voucher suggestion:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate voucher suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoucherEdit = (field: keyof VoucherSuggestion, value: string | number) => {
    if (!suggestion) return;
    
    const updatedSuggestion = {
      ...suggestion,
      [field]: value
    };
    setSuggestion(updatedSuggestion);
    onVoucherGenerated(updatedSuggestion);
  };

  if (!suggestion) {
    return (
      <Button
        onClick={generateVoucherSuggestion}
        variant="outline"
        size="sm"
        disabled={isLoading}
      >
        <Gift className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Suggest Voucher"}
      </Button>
    );
  }

  return (
    <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Recommended Voucher</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
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
              onChange={(e) => handleVoucherEdit('title', e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={suggestion.description}
              onChange={(e) => handleVoucherEdit('description', e.target.value)}
            />
          </div>
          <div>
            <Label>Discount Value</Label>
            <Input
              value={suggestion.discountValue}
              onChange={(e) => handleVoucherEdit('discountValue', e.target.value)}
            />
          </div>
          <div>
            <Label>Valid Days</Label>
            <Input
              type="number"
              value={suggestion.validDays}
              onChange={(e) => handleVoucherEdit('validDays', parseInt(e.target.value))}
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
  );
};
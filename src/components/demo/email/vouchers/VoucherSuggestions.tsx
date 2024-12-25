import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Review } from "../ReviewVoucherSection";
import { ArrowRight } from "lucide-react";
import { VoucherSuggestionCard } from "./VoucherSuggestionCard";

interface VoucherSuggestionsProps {
  review: Review;
  onGenerateVoucher: (review: Review) => void;
}

export const VoucherSuggestions = ({ review, onGenerateVoucher }: VoucherSuggestionsProps) => {
  const { toast } = useToast();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["voucher-suggestions", review.id],
    queryFn: async () => {
      try {
        const { data: existingSuggestions, error } = await supabase
          .from("review_voucher_suggestions")
          .select("*")
          .eq("review_id", review.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching suggestions:", error);
          return null;
        }

        if (existingSuggestions) {
          return existingSuggestions.suggested_vouchers;
        }

        const { data, error: genError } = await supabase.functions.invoke("generate-voucher-suggestions", {
          body: {
            review: {
              text: review.review_text,
              receiptData: review.receipt_data,
              serverName: review.server_name,
            },
          },
        });

        if (genError) throw genError;

        if (!data?.suggestions) {
          console.error("No suggestions returned from function");
          return null;
        }

        const { error: insertError } = await supabase
          .from("review_voucher_suggestions")
          .insert({
            review_id: review.id,
            suggested_vouchers: data.suggestions,
          });

        if (insertError) throw insertError;

        return data.suggestions;
      } catch (error) {
        console.error("Error in voucher suggestions flow:", error);
        toast({
          title: "Error generating suggestions",
          description: "Failed to generate voucher suggestions. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    },
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Generating suggestions...</div>;
  }

  if (!suggestions?.length) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-gray-700">Suggested Voucher Sequence</h4>
        <ArrowRight className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion: any, index: number) => (
          <VoucherSuggestionCard
            key={index}
            suggestion={suggestion}
            onUse={() => {
              onGenerateVoucher(review);
              toast({
                title: "Voucher email scheduled",
                description: "The voucher email will be generated with this suggestion.",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};
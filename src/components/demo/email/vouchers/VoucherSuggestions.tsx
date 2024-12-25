import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Review } from "../ReviewVoucherSection";

interface VoucherSuggestionsProps {
  review: Review;
  onGenerateVoucher: (review: Review) => void;
}

export const VoucherSuggestions = ({ review, onGenerateVoucher }: VoucherSuggestionsProps) => {
  const { toast } = useToast();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["voucher-suggestions", review.id],
    queryFn: async () => {
      // First, try to get existing suggestions
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

      // If no suggestions exist, generate new ones
      const { data, error: genError } = await supabase.functions.invoke("generate-voucher-suggestions", {
        body: {
          review: {
            text: review.review_text,
            receiptData: review.receipt_data,
            serverName: review.server_name,
          },
        },
      });

      if (genError) {
        console.error("Error generating suggestions:", genError);
        throw genError;
      }

      // Store the generated suggestions
      const { error: insertError } = await supabase
        .from("review_voucher_suggestions")
        .insert({
          review_id: review.id,
          suggested_vouchers: data.suggestions,
        });

      if (insertError) {
        console.error("Error storing suggestions:", insertError);
        throw insertError;
      }

      return data.suggestions;
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
      <h4 className="text-sm font-medium text-gray-700">Suggested Voucher Sequence:</h4>
      <div className="space-y-2">
        {suggestions.map((suggestion: any, index: number) => (
          <div
            key={index}
            className="bg-pink-50/50 p-4 rounded-lg border border-pink-100"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium text-gray-900">{suggestion.title}</p>
                <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                {suggestion.timing && (
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended timing: {suggestion.timing}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onGenerateVoucher(review);
                  toast({
                    title: "Voucher email scheduled",
                    description: "The voucher email will be generated with this suggestion.",
                  });
                }}
              >
                Use Suggestion
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
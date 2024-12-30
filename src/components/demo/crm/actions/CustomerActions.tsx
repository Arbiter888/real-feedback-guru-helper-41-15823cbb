import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { VoucherDisplay } from "../vouchers/VoucherDisplay";

interface CustomerActionsProps {
  onGenerateEmail: () => void;
  isGeneratingEmail: boolean;
  voucherSuggestion?: any;
}

export const CustomerActions = ({ 
  onGenerateEmail, 
  isGeneratingEmail,
  voucherSuggestion 
}: CustomerActionsProps) => {
  return (
    <div className="flex items-start gap-4">
      {voucherSuggestion && (
        <div className="flex-1">
          <VoucherDisplay suggestion={voucherSuggestion} />
        </div>
      )}
      <Button
        onClick={onGenerateEmail}
        variant="default"
        size="sm"
        disabled={!voucherSuggestion || isGeneratingEmail}
        className="whitespace-nowrap"
      >
        {isGeneratingEmail ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Generate Thank You Email
          </>
        )}
      </Button>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

interface EmailPreviewCardProps {
  email: {
    email_subject: string;
    email_content: string;
    voucher_details: any;
  };
  onSendEmail: () => void;
}

export const EmailPreviewCard = ({ email, onSendEmail }: EmailPreviewCardProps) => {
  return (
    <Card className="mt-4 p-6 space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium">Subject: {email.email_subject}</h3>
        </div>
        
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-left">{email.email_content}</div>
        </div>

        {email.voucher_details && (
          <div className="bg-pink-50/50 rounded-xl p-6 space-y-2 border border-pink-100">
            <h4 className="text-primary font-medium">Special Offer</h4>
            <p className="text-sm">Code: {email.voucher_details.code}</p>
            <p className="text-sm">Discount: {email.voucher_details.discount}</p>
            <p className="text-sm">Valid for: {email.voucher_details.validDays} days</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onSendEmail}>
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>
    </Card>
  );
};
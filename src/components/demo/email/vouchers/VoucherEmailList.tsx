import { Calendar } from "lucide-react";
import { VoucherEmail } from "../ReviewVoucherSection";

interface VoucherEmailListProps {
  voucherEmails: VoucherEmail[];
}

export const VoucherEmailList = ({ voucherEmails }: VoucherEmailListProps) => {
  return (
    <div className="space-y-4">
      {voucherEmails?.map((email) => (
        <div
          key={email.id}
          className="border rounded-lg p-4 space-y-2 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <p className="font-medium">{email.email_subject}</p>
            {email.recipient_email && (
              <p className="text-sm text-gray-600">
                To: {email.recipient_email}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Voucher Code: {email.voucher_code}
          </p>
          <p className="text-sm">{email.email_content}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            {email.scheduled_for 
              ? `Scheduled for: ${new Date(email.scheduled_for).toLocaleDateString()}`
              : 'Not scheduled'}
          </div>
          <p className="text-xs text-gray-500">
            Created: {new Date(email.created_at).toLocaleDateString()}
            {email.sent_at && ` • Sent: ${new Date(email.sent_at).toLocaleDateString()}`}
          </p>
        </div>
      ))}
    </div>
  );
};
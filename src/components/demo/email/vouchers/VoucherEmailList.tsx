import { Calendar, Eye } from "lucide-react";
import { VoucherEmail } from "../ReviewVoucherSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmailPreview } from "../EmailPreview";
import { useState } from "react";

interface VoucherEmailListProps {
  voucherEmails: VoucherEmail[];
  restaurantInfo?: {
    restaurantName: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    phoneNumber: string;
    bookingUrl: string;
    googleMapsUrl: string;
  };
}

export const VoucherEmailList = ({ voucherEmails, restaurantInfo }: VoucherEmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<VoucherEmail | null>(null);

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
          <p className="text-sm line-clamp-2">{email.email_content}</p>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {email.scheduled_for 
                ? `Scheduled for: ${new Date(email.scheduled_for).toLocaleDateString()}`
                : 'Not scheduled'}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  onClick={() => setSelectedEmail(email)}
                  className="flex items-center gap-1 px-2 py-1 text-primary hover:bg-primary/10 rounded"
                >
                  <Eye className="w-4 h-4" />
                  Preview Email
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Email Preview</DialogTitle>
                </DialogHeader>
                {selectedEmail && restaurantInfo && (
                  <EmailPreview
                    emailSubject={selectedEmail.email_subject}
                    htmlContent={selectedEmail.email_content}
                    showPreview={true}
                    restaurantInfo={restaurantInfo}
                  />
                )}
              </DialogContent>
            </Dialog>
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
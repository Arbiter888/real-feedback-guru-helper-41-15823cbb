import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmailPreview } from "../EmailPreview";
import { useState } from "react";
import { VoucherEmail } from "../../email/ReviewVoucherSection";

interface VoucherEmailListProps {
  voucherEmails: VoucherEmail[];
}

export const VoucherEmailList = ({ voucherEmails }: VoucherEmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<VoucherEmail | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {voucherEmails?.map((email) => (
        <Card key={email.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            {/* Email Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{email.email_subject}</h3>
              <Badge className={getStatusColor(email.status)}>
                {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
              </Badge>
            </div>

            {/* Email Details */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Voucher Code: {email.voucher_code}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {email.scheduled_for ? (
                  <span>Scheduled for: {new Date(email.scheduled_for).toLocaleDateString()}</span>
                ) : (
                  <span>Created: {new Date(email.created_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Preview Button */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedEmail(email)}
                  className="flex items-center gap-1 px-2 py-1 text-primary hover:bg-primary/10 rounded text-sm"
                >
                  <Eye className="h-4 w-4" />
                  Preview Email
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Email Preview</DialogTitle>
                </DialogHeader>
                {selectedEmail && (
                  <EmailPreview
                    emailSubject={selectedEmail.email_subject}
                    htmlContent={selectedEmail.email_content}
                    showPreview={true}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      ))}

      {voucherEmails.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No voucher emails have been generated yet.
        </div>
      )}
    </div>
  );
};
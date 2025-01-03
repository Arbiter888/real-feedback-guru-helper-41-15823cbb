import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import QRCode from "qrcode";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface RestaurantInfo {
  restaurantName: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
  googleMapsUrl?: string;
}

interface EmailPreviewCardProps {
  email: {
    email_subject: string;
    email_content: string;
    voucher_details?: any;
  };
  onSendEmail: () => void;
  restaurantInfo: RestaurantInfo;
  recipientEmail?: string;
  allowEdit?: boolean;
}

export const EmailPreviewCard = ({ 
  email, 
  onSendEmail, 
  restaurantInfo,
  recipientEmail,
  allowEdit = false
}: EmailPreviewCardProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(email.email_subject);
  const [editedContent, setEditedContent] = useState(email.email_content);

  useEffect(() => {
    const generateQRCode = async () => {
      if (email.voucher_details?.code) {
        try {
          const qrDataUrl = await QRCode.toDataURL(email.voucher_details.code, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setQrCodeUrl(qrDataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [email.voucher_details?.code]);

  const handleSave = () => {
    email.email_subject = editedSubject;
    email.email_content = editedContent;
    setIsEditing(false);
  };

  return (
    <Card className="mt-4 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Email Preview</h3>
        <div className="flex gap-2">
          {allowEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <Edit2 className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </div>

      {recipientEmail && (
        <div className="text-sm text-muted-foreground">
          Recipient: {recipientEmail}
        </div>
      )}

      {showPreview && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            {isEditing ? (
              <Input
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="font-medium"
                placeholder="Email subject"
              />
            ) : (
              <h3 className="font-medium">Subject: {editedSubject}</h3>
            )}
          </div>
          
          <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px] w-full"
                placeholder="Email content"
              />
            ) : (
              <div 
                className="text-left email-content"
                dangerouslySetInnerHTML={{ __html: editedContent }}
              />
            )}

            {email.voucher_details && (
              <div className="my-8 bg-pink-50/50 rounded-xl p-6 space-y-4 border border-pink-100">
                <h4 className="text-primary font-medium text-lg">Special Offer</h4>
                <div className="flex items-center gap-6">
                  {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{email.voucher_details.title}</p>
                    <p className="text-sm text-gray-600">Code: {email.voucher_details.code}</p>
                    <p className="text-sm text-gray-600">
                      Valid for: {email.voucher_details.validDays} days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button onClick={handleSave} variant="outline">
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
            <Button onClick={onSendEmail}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
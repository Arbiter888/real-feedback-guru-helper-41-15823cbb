import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Eye, EyeOff } from "lucide-react";
import QRCode from "qrcode";

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
    voucher_details: any;
  };
  onSendEmail: () => void;
  restaurantInfo: RestaurantInfo;
}

export const EmailPreviewCard = ({ email, onSendEmail, restaurantInfo }: EmailPreviewCardProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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

  return (
    <Card className="mt-4 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Email Preview</h3>
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

      {showPreview && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">Subject: {email.email_subject}</h3>
          </div>
          
          <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
            <div 
              className="text-left email-content"
              dangerouslySetInnerHTML={{ __html: email.email_content }}
            />

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

          <div className="flex justify-end">
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
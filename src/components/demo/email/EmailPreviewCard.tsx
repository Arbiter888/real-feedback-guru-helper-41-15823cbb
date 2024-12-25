import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Eye, EyeOff } from "lucide-react";
import QRCode from "qrcode";
import { RestaurantInfo } from "@/components/demo/RestaurantInfo";

interface EmailPreviewCardProps {
  email: {
    email_subject: string;
    email_content: string;
    voucher_details: any;
  };
  onSendEmail: () => void;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
}

export const EmailPreviewCard = ({ email, onSendEmail, restaurantInfo }: EmailPreviewCardProps) => {
  const [showPreview, setShowPreview] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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

  // Generate QR code when voucher details are available
  useState(() => {
    generateQRCode();
  }, [email.voucher_details?.code]);

  const renderEmailFooter = () => (
    <div style={{ marginTop: '30px', padding: '20px 0', borderTop: '1px solid #eee' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
        {restaurantInfo.restaurantName}
      </h2>
      <div style={{ marginBottom: '20px' }}>
        {restaurantInfo.phoneNumber && (
          <p style={{ margin: '8px 0' }}>
            <a href={`tel:${restaurantInfo.phoneNumber}`} style={{ color: '#E94E87', textDecoration: 'none', fontWeight: 500 }}>
              📞 {restaurantInfo.phoneNumber}
            </a>
          </p>
        )}
        {restaurantInfo.googleMapsUrl && (
          <p style={{ margin: '8px 0' }}>
            <a href={restaurantInfo.googleMapsUrl} style={{ color: '#E94E87', textDecoration: 'none', fontWeight: 500 }}>
              📍 Find us on Google Maps
            </a>
          </p>
        )}
      </div>
      <div style={{ marginTop: '16px' }}>
        {restaurantInfo.websiteUrl && (
          <a href={restaurantInfo.websiteUrl} style={{ color: '#E94E87', textDecoration: 'none', marginRight: '16px', fontWeight: 500 }}>
            🌐 Visit our Website
          </a>
        )}
        {restaurantInfo.facebookUrl && (
          <a href={restaurantInfo.facebookUrl} style={{ color: '#E94E87', textDecoration: 'none', marginRight: '16px', fontWeight: 500 }}>
            👥 Follow us on Facebook
          </a>
        )}
        {restaurantInfo.instagramUrl && (
          <a href={restaurantInfo.instagramUrl} style={{ color: '#E94E87', textDecoration: 'none', fontWeight: 500 }}>
            📸 Follow us on Instagram
          </a>
        )}
      </div>
    </div>
  );

  return (
    <Card className="mt-4 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Email</h3>
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
            <div className="whitespace-pre-wrap text-left">{email.email_content}</div>

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

            {renderEmailFooter()}
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
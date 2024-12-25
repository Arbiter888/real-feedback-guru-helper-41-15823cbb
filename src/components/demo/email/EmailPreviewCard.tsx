import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Eye, EyeOff, Receipt, Clock } from "lucide-react";
import QRCode from "qrcode";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReceiptAnalysisDisplay } from "../ReceiptAnalysisDisplay";

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
  receiptData?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
}

export const EmailPreviewCard = ({ email, onSendEmail, restaurantInfo, receiptData }: EmailPreviewCardProps) => {
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
    <Card className="mt-4 overflow-hidden border-primary/10">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">{email.email_subject}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Scheduled to send in 24 hours</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="hover:bg-primary/10"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
        </div>
      </div>

      {showPreview && (
        <div className="p-6 space-y-6">
          <div className="prose max-w-none space-y-6">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
              {email.email_content}
            </div>

            {receiptData && (
              <div className="my-8">
                <ReceiptAnalysisDisplay analysisResult={receiptData} />
              </div>
            )}

            {email.voucher_details && (
              <div className="bg-primary/5 rounded-xl p-6 space-y-4 not-prose border border-primary/10">
                <h4 className="text-primary font-medium text-lg flex items-center gap-2">
                  🎁 Special Offer
                </h4>
                <div className="flex items-center gap-6">
                  {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <p className="text-xl font-semibold">{email.voucher_details.title}</p>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-sm">
                        Code: {email.voucher_details.code}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Valid for {email.voucher_details.validDays} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-secondary/5 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  {restaurantInfo?.restaurantName || 'Our Restaurant'}
                </h2>
                <div className="space-y-3 mb-6">
                  {restaurantInfo?.phoneNumber && (
                    <a href={`tel:${restaurantInfo.phoneNumber}`} 
                      className="flex items-center text-primary hover:text-primary-dark transition-colors">
                      <span className="mr-2">📞</span>
                      {restaurantInfo.phoneNumber}
                    </a>
                  )}
                  {restaurantInfo?.googleMapsUrl && (
                    <a href={restaurantInfo.googleMapsUrl} 
                      className="flex items-center text-primary hover:text-primary-dark transition-colors">
                      <span className="mr-2">📍</span>
                      Find us on Google Maps
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  {restaurantInfo?.websiteUrl && (
                    <a href={restaurantInfo.websiteUrl} 
                      className="text-primary hover:text-primary-dark transition-colors">
                      🌐 Visit our Website
                    </a>
                  )}
                  {restaurantInfo?.facebookUrl && (
                    <a href={restaurantInfo.facebookUrl} 
                      className="text-primary hover:text-primary-dark transition-colors">
                      👥 Follow us on Facebook
                    </a>
                  )}
                  {restaurantInfo?.instagramUrl && (
                    <a href={restaurantInfo.instagramUrl} 
                      className="text-primary hover:text-primary-dark transition-colors">
                      📸 Follow us on Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button onClick={onSendEmail} className="w-full sm:w-auto">
              <Send className="w-4 h-4 mr-2" />
              Schedule Email
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
import { Label } from "@/components/ui/label";

interface EmailPreviewProps {
  emailSubject: string;
  htmlContent: string;
  showPreview: boolean;
  restaurantInfo: RestaurantInfo;
}

interface RestaurantInfo {
  restaurantName: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
}

export const EmailPreview = ({ emailSubject, htmlContent, showPreview, restaurantInfo }: EmailPreviewProps) => {
  if (!showPreview) return null;

  const footerHtml = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #666; font-size: 14px;">Contact us:</p>
      ${restaurantInfo.phoneNumber ? `<p style="margin: 5px 0;"><a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none;">📞 ${restaurantInfo.phoneNumber}</a></p>` : ''}
      ${restaurantInfo.websiteUrl ? `<p style="margin: 5px 0;"><a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none;">🌐 Visit our website</a></p>` : ''}
      ${restaurantInfo.bookingUrl ? `<p style="margin: 5px 0;"><a href="${restaurantInfo.bookingUrl}" style="color: #E94E87; text-decoration: none;">📅 Make a reservation</a></p>` : ''}
      <div style="margin-top: 10px;">
        ${restaurantInfo.facebookUrl ? `<a href="${restaurantInfo.facebookUrl}" style="margin-right: 10px; color: #E94E87; text-decoration: none;">Facebook</a>` : ''}
        ${restaurantInfo.instagramUrl ? `<a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none;">Instagram</a>` : ''}
      </div>
    </div>
  `;

  const fullHtmlContent = htmlContent + footerHtml;

  return (
    <div className="mt-6 space-y-4">
      <Label>Email Preview</Label>
      <div className="p-6 border rounded-lg bg-white space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-left">Subject: {emailSubject}</h3>
        </div>
        <div className="prose max-w-none text-left">
          <div dangerouslySetInnerHTML={{ __html: fullHtmlContent }} />
        </div>
      </div>
    </div>
  );
};
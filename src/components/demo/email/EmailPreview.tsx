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
  googleMapsUrl: string;
}

export const EmailPreview = ({ emailSubject, htmlContent, showPreview, restaurantInfo }: EmailPreviewProps) => {
  if (!showPreview) return null;

  // Replace **text** with bold text
  const formattedContent = htmlContent.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="font-weight: 600;">$1</strong>'
  );

  const footerHtml = `
    <div style="margin-top: 30px; padding: 20px 0; border-top: 1px solid #eee;">
      <h2 style="font-size: 24px; margin-bottom: 16px; color: #333;">${restaurantInfo.restaurantName}</h2>
      <div style="margin-bottom: 20px;">
        ${restaurantInfo.phoneNumber ? `
          <p style="margin: 8px 0;">
            <a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
              📞 ${restaurantInfo.phoneNumber}
            </a>
          </p>
        ` : ''}
        ${restaurantInfo.googleMapsUrl ? `
          <p style="margin: 8px 0;">
            <a href="${restaurantInfo.googleMapsUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
              📍 Find us on Google Maps
            </a>
          </p>
        ` : ''}
      </div>
      <div style="margin-top: 16px;">
        ${restaurantInfo.websiteUrl ? `
          <a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
            🌐 Visit our Website
          </a>
        ` : ''}
        ${restaurantInfo.facebookUrl ? `
          <a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
            👥 Follow us on Facebook
          </a>
        ` : ''}
        ${restaurantInfo.instagramUrl ? `
          <a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
            📸 Follow us on Instagram
          </a>
        ` : ''}
      </div>
    </div>
  `;

  return (
    <div className="mt-6 space-y-4">
      <Label>Email Preview</Label>
      <div className="p-6 border rounded-lg bg-white space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-left">Subject: {emailSubject}</h3>
        </div>
        <div className="prose max-w-none text-left">
          <div dangerouslySetInnerHTML={{ __html: formattedContent + footerHtml }} />
        </div>
      </div>
    </div>
  );
};
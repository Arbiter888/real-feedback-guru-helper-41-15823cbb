import { Label } from "@/components/ui/label";

interface EmailPreviewProps {
  emailSubject: string;
  htmlContent: string;
  showPreview: boolean;
  restaurantInfo: RestaurantInfo;
  footerHtml: string;
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

export const EmailPreview = ({ emailSubject, htmlContent, showPreview, restaurantInfo, footerHtml }: EmailPreviewProps) => {
  if (!showPreview) return null;

  // Replace placeholders with actual restaurant info
  const formattedContent = htmlContent
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
    .replace(/\[Your Name\][\s\S]*?\[Website URL\]/g, '')
    .replace(/\[Phone Number\]/g, restaurantInfo.phoneNumber || 'our phone number')
    .replace(/\[Website URL\]/g, restaurantInfo.websiteUrl || 'our website')
    .replace(/\[Restaurant Name\]/g, restaurantInfo.restaurantName)
    .replace(/Warm regards,\s*$/, `Warm regards,\n${restaurantInfo.restaurantName}`);

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
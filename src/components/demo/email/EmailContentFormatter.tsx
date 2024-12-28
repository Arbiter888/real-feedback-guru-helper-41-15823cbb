interface EmailContentFormatterProps {
  content: string;
  images: Array<{
    url: string;
    title: string;
    added: boolean;
    isFooter?: boolean;
  }>;
  restaurantName: string;
  voucherHtml?: string;
  restaurantInfo?: {
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    bookingUrl?: string;
    googleMapsUrl?: string;
    contactEmail?: string;
  };
}

export const formatEmailContent = ({ 
  content, 
  images, 
  restaurantName, 
  voucherHtml,
  restaurantInfo 
}: EmailContentFormatterProps) => {
  // Format the main content with proper spacing
  const mainContent = content.split('\n').map(paragraph => 
    paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
  ).join('\n');

  // Generate signature with available restaurant information
  const signatureLinks = [];
  
  if (restaurantInfo?.websiteUrl) {
    signatureLinks.push(`<a href="${restaurantInfo.websiteUrl}" style="color: #0066cc; text-decoration: none;">Website</a>`);
  }
  if (restaurantInfo?.facebookUrl) {
    signatureLinks.push(`<a href="${restaurantInfo.facebookUrl}" style="color: #0066cc; text-decoration: none;">Facebook</a>`);
  }
  if (restaurantInfo?.instagramUrl) {
    signatureLinks.push(`<a href="${restaurantInfo.instagramUrl}" style="color: #0066cc; text-decoration: none;">Instagram</a>`);
  }
  if (restaurantInfo?.googleMapsUrl) {
    signatureLinks.push(`<a href="${restaurantInfo.googleMapsUrl}" style="color: #0066cc; text-decoration: none;">Find Us</a>`);
  }

  const signature = `
    <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">${restaurantName}</p>
      ${restaurantInfo?.phoneNumber ? `<p style="margin: 0 0 5px 0;">📞 ${restaurantInfo.phoneNumber}</p>` : ''}
      ${restaurantInfo?.contactEmail ? `<p style="margin: 0 0 5px 0;">✉️ ${restaurantInfo.contactEmail}</p>` : ''}
      ${signatureLinks.length > 0 ? 
        `<p style="margin: 10px 0;">
          ${signatureLinks.join(' | ')}
        </p>` 
        : ''
      }
    </div>
  `;

  // Add content images
  const contentImages = images
    .filter(img => img.added && !img.isFooter)
    .map(img => `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
        ${img.title ? `<p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>` : ''}
      </div>
    `).join('\n');

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      ${mainContent}
      ${contentImages}
      ${voucherHtml || ''}
      ${signature}
    </div>
  `;
};
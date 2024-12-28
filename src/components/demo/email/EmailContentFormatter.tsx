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

  // Generate contact links section
  const contactLinks = [];
  if (restaurantInfo?.phoneNumber) {
    contactLinks.push(`
      <p style="margin: 8px 0;">
        <a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
          📞 ${restaurantInfo.phoneNumber}
        </a>
      </p>
    `);
  }
  if (restaurantInfo?.googleMapsUrl) {
    contactLinks.push(`
      <p style="margin: 8px 0;">
        <a href="${restaurantInfo.googleMapsUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
          📍 Find us on Google Maps
        </a>
      </p>
    `);
  }

  // Generate social links section
  const socialLinks = [];
  if (restaurantInfo?.websiteUrl) {
    socialLinks.push(`
      <a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
        🌐 Visit our Website
      </a>
    `);
  }
  if (restaurantInfo?.facebookUrl) {
    socialLinks.push(`
      <a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
        👥 Follow us on Facebook
      </a>
    `);
  }
  if (restaurantInfo?.instagramUrl) {
    socialLinks.push(`
      <a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
        📸 Follow us on Instagram
      </a>
    `);
  }

  // Add content images
  const contentImages = images
    .filter(img => img.added && !img.isFooter)
    .map(img => `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
        ${img.title ? `<p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>` : ''}
      </div>
    `).join('\n');

  // Generate signature with available restaurant information
  const signature = `
    <div style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">${restaurantName}</p>
      ${contactLinks.join('\n')}
      <div style="margin-top: 16px;">
        ${socialLinks.join('\n')}
      </div>
    </div>
  `;

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      ${mainContent}
      ${contentImages}
      ${voucherHtml || ''}
      ${signature}
    </div>
  `;
};
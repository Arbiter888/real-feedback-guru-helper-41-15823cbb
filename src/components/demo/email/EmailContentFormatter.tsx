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
}

export const formatEmailContent = ({ content, images, restaurantName, voucherHtml }: EmailContentFormatterProps) => {
  // Format the main content with proper spacing
  const mainContent = content.split('\n').map(paragraph => 
    paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
  ).join('\n');

  const warmRegards = `
    <p style="margin: 20px 0; line-height: 1.6;">
      Warm regards,<br/>
      ${restaurantName}
    </p>
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
      <p style="margin: 0 0 15px 0; line-height: 1.6;">Dear Food Lover,</p>
      ${mainContent}
      ${contentImages}
      ${voucherHtml || ''}
      ${warmRegards}
    </div>
  `;
};
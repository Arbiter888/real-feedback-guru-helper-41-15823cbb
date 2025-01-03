export const generateWelcomeEmailContent = ({
  firstName,
  restaurantInfo,
  tipAmount,
  tipReward,
  tipRewardCode,
  mysteryVoucherCode,
  qrCodeUrl,
  referralUrl,
  formattedExpirationDate,
}: {
  firstName: string;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
  tipAmount?: number | null;
  tipReward?: number | null;
  tipRewardCode?: string | null;
  mysteryVoucherCode: string;
  qrCodeUrl: string;
  referralUrl: string;
  formattedExpirationDate: string;
}) => {
  const socialLinks = [];
  if (restaurantInfo.websiteUrl) {
    socialLinks.push(`<a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Visit our Website</a>`);
  }
  if (restaurantInfo.facebookUrl) {
    socialLinks.push(`<a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Follow us on Facebook</a>`);
  }
  if (restaurantInfo.instagramUrl) {
    socialLinks.push(`<a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none;">Follow us on Instagram</a>`);
  }

  const contactInfo = [];
  if (restaurantInfo.phoneNumber) {
    contactInfo.push(`<p style="margin: 8px 0;"><a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none;">📞 ${restaurantInfo.phoneNumber}</a></p>`);
  }
  if (restaurantInfo.googleMapsUrl) {
    contactInfo.push(`<p style="margin: 8px 0;"><a href="${restaurantInfo.googleMapsUrl}" style="color: #E94E87; text-decoration: none;">📍 Find us on Google Maps</a></p>`);
  }

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
        Welcome to EatUP!, ${firstName}! 🎉
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
        Thanks for dining with us at ${restaurantInfo.restaurantName}! We hope you enjoyed your 10% discount today.
        We've prepared some additional rewards for your next visit!
      </p>

      ${tipRewardCode ? `
      <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
        <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Next Visit Tip Reward 🎁</h2>
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
          Thanks for your generous £${tipAmount?.toFixed(2)} tip! Here's your £${tipReward?.toFixed(2)} reward for your next visit:
        </p>
        <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
          ${tipRewardCode}
        </p>
        <p style="color: #666; font-size: 14px; font-style: italic;">
          Valid until ${formattedExpirationDate}
        </p>
      </div>
      ` : ''}

      <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
        <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Mystery Reward 🎁</h2>
        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
          We've got a special surprise waiting for you on your next visit! Show this code to unlock your mystery reward:
        </p>
        <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
          ${mysteryVoucherCode}
        </p>
        <p style="color: #666; font-size: 14px; font-style: italic;">
          Valid until ${formattedExpirationDate}
        </p>
      </div>

      <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
        <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Share with Friends & Earn Stars! ⭐</h2>
        <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
          Share your personal referral link with friends and:
        </p>
        <ul style="color: #333; font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
          <li style="margin-bottom: 8px;">They'll get a special welcome reward</li>
          <li style="margin-bottom: 8px;">You'll earn a star for each friend who joins</li>
          <li style="margin-bottom: 8px;">Collect 3 stars to unlock an exclusive reward!</li>
        </ul>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${qrCodeUrl}" alt="Your Referral QR Code" style="width: 200px; height: 200px;" />
        </div>
        <p style="background: white; padding: 12px; border-radius: 6px; font-size: 16px; text-align: center; color: #666; margin: 15px 0; word-break: break-all;">
          ${referralUrl}
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <div style="margin-bottom: 20px;">
          ${contactInfo.join('\n')}
        </div>
        <div style="margin-top: 16px;">
          ${socialLinks.join('\n')}
        </div>
      </div>
    </div>
  `;
};
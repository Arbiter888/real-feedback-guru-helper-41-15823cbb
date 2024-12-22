export const constructRewardEmailBody = (
  businessName: string,
  googleMapsUrl: string,
  uniqueCode: string | null,
  review: string,
) => {
  const visitTimestamp = new Date().toLocaleString();
  
  let emailBody = `Dear ${businessName} Team,\n\n`;
  emailBody += `I'd love to join your restaurant community through EatUP! I'm excited to receive exclusive updates and special offers directly from ${businessName}, while enjoying EatUP!'s innovative rewards program.\n\n`;
  
  if (uniqueCode) {
    emailBody += `My Unique Reward Code: ${uniqueCode}\n`;
    emailBody += `(I'll show this code on my next visit to unlock my special reward)\n\n`;
  }
  
  emailBody += `Visit Details:\n`;
  emailBody += `Date: ${visitTimestamp}\n`;
  emailBody += `Location: ${googleMapsUrl}\n\n`;
  
  emailBody += `My Review:\n${review}\n\n`;

  emailBody += "What I'm Looking Forward To:\n";
  emailBody += `1. Exclusive updates and offers directly from ${businessName}\n`;
  emailBody += "2. Special event invitations and community updates\n";
  emailBody += "3. Progressive rewards that get better with each visit\n\n";

  emailBody += "My Next Steps:\n";
  emailBody += `1. Return to ${businessName} with my unique reward code\n`;
  emailBody += "2. Share my dining experiences to unlock better rewards\n";
  emailBody += "3. Stay connected with your restaurant community\n\n";

  emailBody += `Thank you for welcoming me to the ${businessName} community!\n\n`;
  emailBody += "Best regards,\n";
  emailBody += "[Your Name]";

  return emailBody;
};

export const getEmailRecipients = () => {
  const recipients = ['rewards@eatup.co'];
  
  try {
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');

    if (savedRestaurantInfo) {
      const preferences = JSON.parse(savedRestaurantInfo);
      if (preferences.contactEmail && preferences.contactEmail.trim()) {
        recipients.push(preferences.contactEmail.trim());
      }
    }
  } catch (error) {
    console.error('Error getting email recipients:', error);
  }
  
  return recipients.join(',');
};
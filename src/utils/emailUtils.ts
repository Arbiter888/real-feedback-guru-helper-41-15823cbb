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

export const getEmailSubject = (restaurantName: string) => {
  return `Join ${restaurantName}'s Mailing List & EatUP! Rewards`;
};

export const constructEmailBody = (
  restaurantName: string,
  googleMapsUrl: string,
  rewardCode: string | null,
  reviewText?: string,
  refinedReview?: string,
  analysisResult?: string | null
) => {
  const visitTimestamp = new Date().toLocaleString();
  
  let emailBody = `Dear ${restaurantName} Team,\n\n`;
  emailBody += `I'd love to join your mailing list and the EatUP! rewards program. I'm excited to receive exclusive updates and special offers directly from ${restaurantName}, while enjoying EatUP!'s innovative rewards program.\n\n`;
  
  if (rewardCode) {
    emailBody += `My Unique Reward Code: ${rewardCode}\n`;
    emailBody += `(I'll show this code on my next visit to unlock my special reward)\n\n`;
  }
  
  emailBody += `Visit Details:\n`;
  emailBody += `Date: ${visitTimestamp}\n`;
  emailBody += `Location: ${googleMapsUrl}\n\n`;
  
  if (refinedReview) {
    emailBody += `My Review:\n${refinedReview}\n\n`;
  } else if (reviewText) {
    emailBody += `My Review:\n${reviewText}\n\n`;
  }
  
  // Add receipt analysis if available
  if (analysisResult) {
    const analysis = JSON.parse(analysisResult);
    emailBody += "Receipt Details:\n";
    emailBody += `Total Amount: $${analysis.total_amount}\n`;
    emailBody += "Items:\n";
    analysis.items.forEach((item: { name: string; price: number }) => {
      emailBody += `- ${item.name}: $${item.price}\n`;
    });
    emailBody += "\n";
  }

  emailBody += "What I'm Looking Forward To:\n";
  emailBody += `1. Exclusive updates and offers directly from ${restaurantName}\n`;
  emailBody += "2. Special event invitations and community updates\n";
  emailBody += "3. Progressive rewards that get better with each visit\n\n";

  emailBody += "Thank you for welcoming me to your community!\n\n";
  emailBody += "Best regards,\n";
  emailBody += "[Your Name]";

  return emailBody;
};

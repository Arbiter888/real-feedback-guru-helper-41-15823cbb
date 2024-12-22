import { Button } from "@/components/ui/button";
import { Gift, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface EmailCaptureProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
}

export const EmailCapture = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName 
}: EmailCaptureProps) => {
  const [restaurantName, setRestaurantName] = useState(customRestaurantName || "The Local Kitchen & Bar");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(customGoogleMapsUrl || "https://maps.app.goo.gl/Nx23mQHet4TBfctJ6");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    
    if (savedRestaurantInfo) {
      const { 
        restaurantName: savedRestaurantName,
        googleMapsUrl: savedGoogleMapsUrl,
        contactEmail: savedContactEmail
      } = JSON.parse(savedRestaurantInfo);
      
      if (!customRestaurantName) setRestaurantName(savedRestaurantName);
      if (!customGoogleMapsUrl) setGoogleMapsUrl(savedGoogleMapsUrl);
      if (savedContactEmail) setContactEmail(savedContactEmail);
    }
  }, [customRestaurantName, customGoogleMapsUrl]);

  const handleEmailClick = () => {
    const analysisResult = localStorage.getItem('receiptAnalysis');
    const reviewText = localStorage.getItem('reviewText');
    const refinedReview = localStorage.getItem('refinedReview');
    const visitTimestamp = new Date().toLocaleString();
    
    let emailBody = `Dear ${restaurantName} Team,\n\n`;
    emailBody += `I'd love to join your restaurant community through EatUP! I'm excited to receive exclusive updates and special offers directly from ${restaurantName}, while enjoying EatUP!'s innovative rewards program.\n\n`;
    
    if (rewardCode) {
      emailBody += `My Unique Reward Code: ${rewardCode}\n`;
      emailBody += `(I'll show this code on my next visit to unlock my special reward)\n\n`;
    }
    
    emailBody += `Visit Details:\n`;
    emailBody += `Date: ${visitTimestamp}\n`;
    emailBody += `Location: ${googleMapsUrl}\n\n`;
    
    // Add the enhanced review if available, otherwise use original review
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

    emailBody += "My Next Steps:\n";
    emailBody += `1. Return to ${restaurantName} with my unique reward code\n`;
    emailBody += "2. Share my dining experiences to unlock better rewards\n";
    emailBody += "3. Stay connected with your restaurant community\n\n";

    emailBody += `Thank you for welcoming me to the ${restaurantName} community!\n\n`;
    emailBody += "Best regards,\n";
    emailBody += "[Your Name]";

    const recipients = ['rewards@eatup.co'];
    if (contactEmail) {
      recipients.push(contactEmail);
    }
    
    const mailtoLink = `mailto:${recipients.join(',')}?subject=Join ${encodeURIComponent(restaurantName)}'s Community on EatUP!&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-3">
        <Gift className="h-8 w-8 text-[#E94E87]" />
        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
          Join Our Restaurant Community! 🎁
        </h3>
      </div>

      <div>
        <p className="text-center text-gray-600 text-lg mb-6">
          {rewardCode 
            ? "Sign up now to receive exclusive updates and offers directly from the restaurant!" 
            : "Join our community to receive special offers and stay connected with your favorite restaurant!"}
        </p>
        <Button 
          onClick={handleEmailClick}
          className="w-full h-12 px-8 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
        >
          <Mail className="h-5 w-5" />
          <span>Join {restaurantName}'s Community</span>
        </Button>
      </div>
    </div>
  );
};
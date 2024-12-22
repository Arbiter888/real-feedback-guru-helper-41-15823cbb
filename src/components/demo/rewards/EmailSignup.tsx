import { Button } from "@/components/ui/button";
import { Gift, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { constructEmailBody, getEmailSubject } from "@/utils/emailUtils";

interface EmailSignupProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
}

export const EmailSignup = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName 
}: EmailSignupProps) => {
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
    
    const recipients = ['rewards@eatup.co'];
    if (contactEmail) {
      recipients.push(contactEmail);
    }

    const emailBody = constructEmailBody(
      restaurantName,
      googleMapsUrl,
      rewardCode,
      reviewText || undefined,
      refinedReview || undefined,
      analysisResult
    );
    
    const mailtoLink = `mailto:${recipients.join(',')}?subject=${encodeURIComponent(getEmailSubject(restaurantName))}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-3">
        <Gift className="h-8 w-8 text-[#E94E87]" />
        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
          Join Our Mailing List! 🎁
        </h3>
      </div>

      <div>
        <p className="text-center text-gray-600 text-lg mb-6">
          Sign up to our mailing list and EatUP! rewards to receive exclusive offers and updates
        </p>
        <Button 
          onClick={handleEmailClick}
          className="w-full h-12 px-8 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
        >
          <Mail className="h-5 w-5" />
          <span>Sign Up to Our Mailing List</span>
        </Button>
      </div>
    </div>
  );
};
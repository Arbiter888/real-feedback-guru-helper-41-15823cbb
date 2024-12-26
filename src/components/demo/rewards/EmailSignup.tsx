import { Button } from "@/components/ui/button";
import { Gift, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    setIsLoading(true);
    try {
      // First, get or create the restaurant's email list
      const { data: listData, error: listError } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: restaurantName
        });

      if (listError) throw listError;

      // Get the email from localStorage (saved during review submission)
      const reviewData = localStorage.getItem('reviewData');
      const email = reviewData ? JSON.parse(reviewData).email : null;

      if (!email) {
        toast({
          title: "Error",
          description: "No email found. Please try submitting your review again.",
          variant: "destructive",
        });
        return;
      }

      // Add the email to the list
      const { error: contactError } = await supabase
        .from('email_contacts')
        .insert({
          list_id: listData,
          email: email
        });

      if (contactError) throw contactError;

      toast({
        title: "Success!",
        description: "You've been added to the mailing list.",
      });

    } catch (error: any) {
      console.error('Error signing up for email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up for the mailing list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          onClick={handleEmailSignup}
          disabled={isLoading}
          className="w-full h-12 px-8 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
        >
          <Mail className="h-5 w-5" />
          <span>{isLoading ? "Signing up..." : "Sign Up to Our Mailing List"}</span>
        </Button>
      </div>
    </div>
  );
};
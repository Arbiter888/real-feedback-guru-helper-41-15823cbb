import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";
import { CustomerCRMSection } from "@/components/demo/crm/CustomerCRMSection";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";
import { RestaurantInfoSection } from "./sections/RestaurantInfoSection";

interface RestaurantInfo {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
  preferredBookingMethod: 'phone' | 'website';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [reviewPageId, setReviewPageId] = useState<string | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    restaurantName: "",
    googleMapsUrl: "",
    contactEmail: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    phoneNumber: "",
    bookingUrl: "",
    preferredBookingMethod: 'phone'
  });

  useEffect(() => {
    // Load saved preferences if they exist
    const savedInfo = localStorage.getItem('restaurantInfo');
    const savedReviewPageId = localStorage.getItem('reviewPageId');
    const savedUrl = localStorage.getItem('generatedUrl');
    
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setRestaurantInfo(prev => ({
        ...prev,
        ...parsed
      }));
    }
    
    if (savedReviewPageId) {
      setReviewPageId(savedReviewPageId);
    }

    if (savedUrl) {
      setGeneratedUrl(savedUrl);
    }
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleHomeClick}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard Demo</h1>
          </div>
        </div>
        
        <div className="grid gap-6">
          {/* Restaurant Information Section */}
          <RestaurantInfoSection
            restaurantInfo={restaurantInfo}
            setRestaurantInfo={setRestaurantInfo}
          />
          
          {/* Review Page Creation Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-4">Create Your Review & Rewards Collection Page</h2>
              <p className="text-muted-foreground mb-6">
                Generate professional materials to collect reviews & rewards:
              </p>
              <ul className="text-sm md:text-base text-gray-600 max-w-xl mx-auto text-left list-disc pl-8 mb-6">
                <li>Display table cards with QR codes at each table</li>
                <li>Place the QR code on receipts and menus</li>
                <li>Show the professional PDF display at your counter</li>
              </ul>
              <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-8">
                Make it easy for customers to recognize great service and get rewarded while dining with you.
              </p>
              
              <div className="space-y-4 text-left border-t border-pink-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800">What You'll Get:</h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">1.</span>
                    A beautifully designed review and rewards collection page
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">2.</span>
                    Professional table cards with QR codes
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">3.</span>
                    Branded QR codes with "Get Rewarded for Tips & Reviews" text
                  </li>
                </ol>
              </div>
              
              <CreateReviewPageButton 
                setGeneratedUrl={setGeneratedUrl} 
                setReviewPageId={setReviewPageId}
              />
              
              <ReviewPageUrlSection
                restaurantName={restaurantInfo.restaurantName}
                googleMapsUrl={restaurantInfo.googleMapsUrl}
                generatedUrl={generatedUrl}
              />
            </div>
          </div>

          {/* Email Management Section */}
          <EmailManagementSection restaurantInfo={restaurantInfo} />

          {/* Customer CRM Section */}
          <CustomerCRMSection restaurantInfo={restaurantInfo} />
        </div>
      </div>
    </div>
  );
}
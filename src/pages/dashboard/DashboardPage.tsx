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
              <h2 className="text-3xl font-bold mb-2">Launch Your Restaurant's Digital Rewards Hub</h2>
              <p className="text-xl text-gray-600 mb-8">Turn Happy Diners into Loyal Customers</p>

              <div className="space-y-8 max-w-2xl mx-auto">
                {/* Engage Customers Section */}
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Engage Customers Everywhere:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Place QR-coded table cards for easy access
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Add QR codes to receipts for post-dining engagement
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Display professional signage at your entrance and counter
                    </li>
                  </ul>
                </div>

                {/* Reward & Collect Section */}
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Reward & Collect:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Instantly reward customers for their reviews
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Gather valuable feedback about your service
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Build your customer database effortlessly
                    </li>
                  </ul>
                </div>

                {/* What You'll Get Section */}
                <div className="text-left border-t border-pink-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Complete Digital Rewards Kit:</h3>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      Custom-branded review & rewards collection page
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      Professional table cards with your unique QR code
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      Ready-to-print materials with "Get Rewarded for Tips & Reviews"
                    </li>
                  </ol>
                </div>

                <p className="text-gray-600 italic mt-6">
                  Start turning every dining experience into an opportunity for growth and customer loyalty.
                </p>
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
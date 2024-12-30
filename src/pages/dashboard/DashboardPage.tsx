import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";
import { CustomerCRMSection } from "@/components/demo/crm/CustomerCRMSection";
import { RestaurantInfoSection } from "./sections/RestaurantInfoSection";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [reviewPageId, setReviewPageId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const MobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] sm:w-[350px]">
        <div className="flex flex-col gap-4 py-4">
          <Button variant="outline" onClick={handleHomeClick} className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          {/* Add more navigation items here if needed */}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            {isMobile ? (
              <MobileMenu />
            ) : (
              <Button variant="outline" onClick={handleHomeClick}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            )}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Restaurant Dashboard Demo</h1>
          </div>
        </div>
        
        <div className="grid gap-4 md:gap-6">
          {/* Restaurant Information Section */}
          <RestaurantInfoSection
            restaurantInfo={restaurantInfo}
            setRestaurantInfo={setRestaurantInfo}
          />
          
          {/* Review Page Creation Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="text-center py-4 md:py-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Create Your Review Page</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Start collecting reviews and managing your restaurant's online presence
              </p>
              <CreateReviewPageButton 
                setGeneratedUrl={setGeneratedUrl}
                setReviewPageId={setReviewPageId}
              />
              
              {generatedUrl && (
                <div className="mt-4 md:mt-8">
                  <ReviewPageUrlSection
                    restaurantName={restaurantInfo.restaurantName}
                    googleMapsUrl={restaurantInfo.googleMapsUrl}
                    generatedUrl={generatedUrl}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Email Management Section */}
          <EmailManagementSection restaurantInfo={restaurantInfo} />

          {/* Customer CRM Section */}
          <CustomerCRMSection restaurantInfo={restaurantInfo} />

          {/* Analytics Section */}
          {reviewPageId && (
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <div className="min-w-[300px]">
                <ReviewPageAnalytics reviewPageId={reviewPageId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
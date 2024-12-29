'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ChevronDown, ChevronUp } from "lucide-react";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";
import { CustomerCRMSection } from "@/components/demo/crm/CustomerCRMSection";
import { RestaurantInfoSection } from "./sections/RestaurantInfoSection";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { redirect } from 'next/navigation';

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
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [reviewPageId, setReviewPageId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
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
    redirect("/");
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
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-white rounded-xl shadow-lg">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Create Your Review & Rewards Collection Page</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="px-6 pb-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">
                  Generate a professional PDF with QR code for your payment counter. Make it easy for customers to recognize great service and share their experience while getting rewarded.
                </p>
                <CreateReviewPageButton 
                  setGeneratedUrl={setGeneratedUrl}
                  setReviewPageId={setReviewPageId}
                />
                
                {generatedUrl && (
                  <div className="mt-8">
                    <div className="space-y-4 text-left border-t border-pink-200 pt-4 mt-4">
                      <h3 className="font-semibold text-gray-800">What You'll Get:</h3>
                      <ol className="space-y-3 text-sm text-gray-600">
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">1.</span>
                          A beautifully designed review and rewards collection page
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">2.</span>
                          Professional PDF with QR code for your counter
                        </li>
                        <li className="flex gap-2">
                          <span className="font-semibold text-primary">3.</span>
                          Automated dual-rewards system for tips and reviews
                        </li>
                      </ol>
                    </div>
                    <ReviewPageUrlSection
                      restaurantName={restaurantInfo.restaurantName}
                      googleMapsUrl={restaurantInfo.googleMapsUrl}
                      generatedUrl={generatedUrl}
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Email Management Section */}
          <EmailManagementSection restaurantInfo={restaurantInfo} />

          {/* Customer CRM Section */}
          <CustomerCRMSection restaurantInfo={restaurantInfo} />

          {/* Analytics Section */}
          {reviewPageId && (
            <div className="bg-white rounded-xl shadow-lg">
              <ReviewPageAnalytics reviewPageId={reviewPageId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
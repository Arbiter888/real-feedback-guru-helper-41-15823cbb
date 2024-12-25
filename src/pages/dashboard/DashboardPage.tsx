import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";
import { RestaurantInfoSection } from "@/components/dashboard/RestaurantInfoSection";
import { ReviewPageSection } from "@/components/dashboard/ReviewPageSection";
import { RestaurantInfo } from "@/types/restaurant";

export default function DashboardPage() {
  const { user } = useAuth();
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
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const savedInfo = localStorage.getItem('restaurantInfo');
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setRestaurantInfo(prev => ({
        ...prev,
        ...parsed
      }));
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  const handleSaveRestaurantInfo = (info: RestaurantInfo) => {
    setRestaurantInfo(info);
    localStorage.setItem('restaurantInfo', JSON.stringify(info));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFE5ED] to-[#FFD5E2]/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6">
          <RestaurantInfoSection 
            initialInfo={restaurantInfo}
            onSave={handleSaveRestaurantInfo}
          />
          
          <ReviewPageSection
            restaurantName={restaurantInfo.restaurantName}
            googleMapsUrl={restaurantInfo.googleMapsUrl}
            generatedUrl={generatedUrl}
            reviewPageId={reviewPageId}
            onUrlGenerated={setGeneratedUrl}
            onPageCreated={setReviewPageId}
          />

          <EmailManagementSection restaurantInfo={restaurantInfo} />

          <div className="bg-white rounded-xl shadow-lg">
            <ReviewPageAnalytics reviewPageId={reviewPageId || ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
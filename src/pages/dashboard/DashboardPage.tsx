import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";
import { ReviewPageAnalytics } from "@/components/demo/ReviewPageAnalytics";
import { EmailManagementSection } from "@/components/demo/EmailManagementSection";

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

    // Load saved preferences if they exist
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

  const handleSavePreferences = () => {
    if (!restaurantInfo.restaurantName || !restaurantInfo.googleMapsUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both restaurant name and Google Maps URL.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('restaurantInfo', JSON.stringify(restaurantInfo));

    toast({
      title: "Preferences saved",
      description: "Your restaurant information has been saved successfully.",
    });
  };

  const handleInputChange = (field: keyof RestaurantInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestaurantInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
          {/* Restaurant Information Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  value={restaurantInfo.restaurantName}
                  onChange={handleInputChange('restaurantName')}
                  placeholder="Enter your restaurant name"
                />
              </div>

              <div>
                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                <Input
                  id="googleMapsUrl"
                  value={restaurantInfo.googleMapsUrl}
                  onChange={handleInputChange('googleMapsUrl')}
                  placeholder="Paste your Google Maps link"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={restaurantInfo.contactEmail}
                  onChange={handleInputChange('contactEmail')}
                  placeholder="Enter restaurant contact email"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={restaurantInfo.websiteUrl}
                  onChange={handleInputChange('websiteUrl')}
                  placeholder="Enter your website URL"
                />
              </div>

              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={restaurantInfo.facebookUrl}
                  onChange={handleInputChange('facebookUrl')}
                  placeholder="Enter your Facebook page URL"
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={restaurantInfo.instagramUrl}
                  onChange={handleInputChange('instagramUrl')}
                  placeholder="Enter your Instagram profile URL"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={restaurantInfo.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="bookingUrl">Booking URL</Label>
                <Input
                  id="bookingUrl"
                  value={restaurantInfo.bookingUrl}
                  onChange={handleInputChange('bookingUrl')}
                  placeholder="Enter your booking page URL"
                />
              </div>

              <Button onClick={handleSavePreferences} className="w-full">
                Save Restaurant Information
              </Button>
            </div>
          </div>
          
          {/* Review Page Creation Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-4">Create Your Review Page</h2>
              <p className="text-muted-foreground mb-6">
                Start collecting reviews and managing your restaurant's online presence
              </p>
              <CreateReviewPageButton 
                setGeneratedUrl={setGeneratedUrl}
                setReviewPageId={setReviewPageId}
              />
              
              {generatedUrl && (
                <div className="mt-8">
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

          {/* Analytics Section */}
          <div className="bg-white rounded-xl shadow-lg">
            <ReviewPageAnalytics reviewPageId={reviewPageId || ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
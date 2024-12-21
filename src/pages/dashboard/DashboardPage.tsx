import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }

    // Load saved preferences if they exist
    const savedInfo = localStorage.getItem('restaurantInfo');
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setRestaurantName(parsed.restaurantName || '');
      setGoogleMapsUrl(parsed.googleMapsUrl || '');
      setContactEmail(parsed.contactEmail || '');
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
    if (!restaurantName || !googleMapsUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both restaurant name and Google Maps URL.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('restaurantInfo', JSON.stringify({
      restaurantName,
      googleMapsUrl,
      contactEmail,
    }));

    toast({
      title: "Preferences saved",
      description: "Your restaurant information has been saved successfully.",
    });
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
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
              <Input
                id="googleMapsUrl"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="Paste your Google Maps link"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Enter restaurant contact email"
              />
            </div>

            <Button onClick={handleSavePreferences} className="w-full">
              Save Restaurant Information
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Create Your Review Page</h2>
            <p className="text-muted-foreground mb-6">
              Start collecting reviews and managing your restaurant's online presence
            </p>
            <CreateReviewPageButton setGeneratedUrl={setGeneratedUrl} />
            
            {/* Add the URL and QR code section */}
            <ReviewPageUrlSection
              restaurantName={restaurantName}
              googleMapsUrl={googleMapsUrl}
              generatedUrl={generatedUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { BasicInfoSection } from "./restaurant/BasicInfoSection";
import { SocialMediaSection } from "./restaurant/SocialMediaSection";
import { ServerManagementSection } from "./restaurant/ServerManagementSection";
import { RestaurantContactCard } from "./RestaurantContactCard";

interface RestaurantInfoProps {
  onRestaurantInfoSaved: (name: string, url: string, email: string, serverNames: string[]) => void;
}

export const RestaurantInfo = ({ onRestaurantInfoSaved }: RestaurantInfoProps) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [serverNames, setServerNames] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("RestaurantInfo: Loading saved preferences");
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const parsedInfo = JSON.parse(savedRestaurantInfo);
      setRestaurantName(parsedInfo.restaurantName || '');
      setGoogleMapsUrl(parsedInfo.googleMapsUrl || '');
      setContactEmail(parsedInfo.contactEmail || '');
      setWebsiteUrl(parsedInfo.websiteUrl || '');
      setFacebookUrl(parsedInfo.facebookUrl || '');
      setInstagramUrl(parsedInfo.instagramUrl || '');
      setServerNames(parsedInfo.serverNames || []);
      console.log("RestaurantInfo: Loaded server names:", parsedInfo.serverNames);
      onRestaurantInfoSaved(
        parsedInfo.restaurantName, 
        parsedInfo.googleMapsUrl, 
        parsedInfo.contactEmail || '', 
        parsedInfo.serverNames || []
      );
    }
  }, [onRestaurantInfoSaved]);

  const handleInfoChange = (field: string, value: string) => {
    switch (field) {
      case 'restaurantName':
        setRestaurantName(value);
        break;
      case 'googleMapsUrl':
        setGoogleMapsUrl(value);
        break;
      case 'contactEmail':
        setContactEmail(value);
        break;
      case 'websiteUrl':
        setWebsiteUrl(value);
        break;
      case 'facebookUrl':
        setFacebookUrl(value);
        break;
      case 'instagramUrl':
        setInstagramUrl(value);
        break;
    }
  };

  const handleServerNamesChange = (names: string[]) => {
    console.log("RestaurantInfo: Updating server names:", names);
    setServerNames(names);
    // Save immediately when server names change
    const updatedInfo = {
      restaurantName,
      googleMapsUrl,
      contactEmail,
      websiteUrl,
      facebookUrl,
      instagramUrl,
      serverNames: names,
    };
    localStorage.setItem('restaurantInfo', JSON.stringify(updatedInfo));
    onRestaurantInfoSaved(restaurantName, googleMapsUrl, contactEmail, names);
  };

  const handleSavePreferences = () => {
    if (!restaurantName.trim() || !googleMapsUrl.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both restaurant name and Google Maps URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      console.log("RestaurantInfo: Saving preferences with server names:", serverNames);
      const restaurantInfo = {
        restaurantName,
        googleMapsUrl,
        contactEmail,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        serverNames,
      };
      
      localStorage.setItem('restaurantInfo', JSON.stringify(restaurantInfo));
      onRestaurantInfoSaved(restaurantName, googleMapsUrl, contactEmail, serverNames);
      
      setShowSuccess(true);
      toast({
        title: "Preferences saved!",
        description: "Your demo has been customized successfully.",
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
        <BasicInfoSection
          restaurantName={restaurantName}
          googleMapsUrl={googleMapsUrl}
          contactEmail={contactEmail}
          onInfoChange={handleInfoChange}
          showSuccess={showSuccess}
        />

        <SocialMediaSection
          websiteUrl={websiteUrl}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          onInfoChange={handleInfoChange}
        />

        <ServerManagementSection
          serverNames={serverNames}
          onServerNamesChange={handleServerNamesChange}
        />

        <Button 
          onClick={handleSavePreferences}
          disabled={isSaving}
          className={`w-full transition-all duration-300 ${
            showSuccess 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {showSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved Successfully!
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            "Save Demo Preferences"
          )}
        </Button>
      </div>

      {restaurantName && (
        <RestaurantContactCard
          name={restaurantName}
          websiteUrl={websiteUrl}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          googleMapsUrl={googleMapsUrl}
        />
      )}
    </div>
  );
};
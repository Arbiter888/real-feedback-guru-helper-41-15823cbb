import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RestaurantInfoCollapsible } from "./restaurant/RestaurantInfoCollapsible";

interface RestaurantInfoProps {
  onRestaurantInfoSaved: (name: string, url: string, email: string, serverNames: string[], reviewRewardAmount: number, tipRewardPercentage: number) => void;
}

export const RestaurantInfo = ({ onRestaurantInfoSaved }: RestaurantInfoProps) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [serverNames, setServerNames] = useState<string[]>([]);
  const [reviewRewardAmount, setReviewRewardAmount] = useState(10);
  const [tipRewardPercentage, setTipRewardPercentage] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
      setReviewRewardAmount(parsedInfo.reviewRewardAmount || 10);
      setTipRewardPercentage(parsedInfo.tipRewardPercentage || 50);
      onRestaurantInfoSaved(
        parsedInfo.restaurantName, 
        parsedInfo.googleMapsUrl, 
        parsedInfo.contactEmail || '', 
        parsedInfo.serverNames || [],
        parsedInfo.reviewRewardAmount || 10,
        parsedInfo.tipRewardPercentage || 50
      );
    }
  }, [onRestaurantInfoSaved]);

  const handleInfoChange = (field: string, value: string | number) => {
    switch (field) {
      case 'restaurantName':
        setRestaurantName(value as string);
        break;
      case 'googleMapsUrl':
        setGoogleMapsUrl(value as string);
        break;
      case 'contactEmail':
        setContactEmail(value as string);
        break;
      case 'websiteUrl':
        setWebsiteUrl(value as string);
        break;
      case 'facebookUrl':
        setFacebookUrl(value as string);
        break;
      case 'instagramUrl':
        setInstagramUrl(value as string);
        break;
      case 'reviewRewardAmount':
        setReviewRewardAmount(value as number);
        break;
      case 'tipRewardPercentage':
        setTipRewardPercentage(value as number);
        break;
    }
  };

  const handleServerNamesChange = (names: string[]) => {
    setServerNames(names);
    const updatedInfo = {
      restaurantName,
      googleMapsUrl,
      contactEmail,
      websiteUrl,
      facebookUrl,
      instagramUrl,
      serverNames: names,
      reviewRewardAmount,
      tipRewardPercentage,
    };
    localStorage.setItem('restaurantInfo', JSON.stringify(updatedInfo));
    onRestaurantInfoSaved(restaurantName, googleMapsUrl, contactEmail, names, reviewRewardAmount, tipRewardPercentage);
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
      const restaurantInfo = {
        restaurantName,
        googleMapsUrl,
        contactEmail,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        serverNames,
        reviewRewardAmount,
        tipRewardPercentage,
      };
      
      localStorage.setItem('restaurantInfo', JSON.stringify(restaurantInfo));
      onRestaurantInfoSaved(restaurantName, googleMapsUrl, contactEmail, serverNames, reviewRewardAmount, tipRewardPercentage);
      
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
    <RestaurantInfoCollapsible
      restaurantName={restaurantName}
      googleMapsUrl={googleMapsUrl}
      contactEmail={contactEmail}
      websiteUrl={websiteUrl}
      facebookUrl={facebookUrl}
      instagramUrl={instagramUrl}
      serverNames={serverNames}
      reviewRewardAmount={reviewRewardAmount}
      tipRewardPercentage={tipRewardPercentage}
      showSuccess={showSuccess}
      isSaving={isSaving}
      onInfoChange={handleInfoChange}
      onServerNamesChange={handleServerNamesChange}
      onSave={handleSavePreferences}
    />
  );
};
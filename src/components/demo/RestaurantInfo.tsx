import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RestaurantContactCard } from "./RestaurantContactCard";

interface RestaurantInfoProps {
  onRestaurantInfoSaved: (name: string, url: string, email: string) => void;
}

export const RestaurantInfo = ({ onRestaurantInfoSaved }: RestaurantInfoProps) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredBookingMethod, setPreferredBookingMethod] = useState("phone");
  const [serverNames, setServerNames] = useState<string[]>([]);
  const [newServerName, setNewServerName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const { 
        restaurantName: savedRestaurantName, 
        googleMapsUrl: savedGoogleMapsUrl, 
        contactEmail: savedContactEmail,
        websiteUrl: savedWebsiteUrl,
        facebookUrl: savedFacebookUrl,
        instagramUrl: savedInstagramUrl,
        phoneNumber: savedPhoneNumber,
        preferredBookingMethod: savedPreferredBookingMethod,
        serverNames: savedServerNames 
      } = JSON.parse(savedRestaurantInfo);
      
      setRestaurantName(savedRestaurantName || '');
      setGoogleMapsUrl(savedGoogleMapsUrl || '');
      setContactEmail(savedContactEmail || '');
      setWebsiteUrl(savedWebsiteUrl || '');
      setFacebookUrl(savedFacebookUrl || '');
      setInstagramUrl(savedInstagramUrl || '');
      setPhoneNumber(savedPhoneNumber || '');
      setPreferredBookingMethod(savedPreferredBookingMethod || 'phone');
      setServerNames(savedServerNames || []);
      onRestaurantInfoSaved(savedRestaurantName, savedGoogleMapsUrl, savedContactEmail || '');
    }
  }, [onRestaurantInfoSaved]);

  const handleAddServer = () => {
    if (!newServerName.trim()) return;
    setServerNames([...serverNames, newServerName.trim()]);
    setNewServerName("");
  };

  const handleRemoveServer = (indexToRemove: number) => {
    setServerNames(serverNames.filter((_, index) => index !== indexToRemove));
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
      localStorage.setItem('restaurantInfo', JSON.stringify({
        restaurantName,
        googleMapsUrl,
        contactEmail,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        phoneNumber,
        preferredBookingMethod,
        serverNames,
      }));

      onRestaurantInfoSaved(restaurantName, googleMapsUrl, contactEmail);
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
        <div className="space-y-2">
          <Label htmlFor="restaurantName">Restaurant Name</Label>
          <Input
            id="restaurantName"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Enter your restaurant name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
          <Input
            id="googleMapsUrl"
            value={googleMapsUrl}
            onChange={(e) => setGoogleMapsUrl(e.target.value)}
            placeholder="Paste your Google Maps link"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter restaurant contact email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Enter your website URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="Enter your Facebook page URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Enter your Instagram profile URL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <Label>Preferred Booking Method</Label>
          <RadioGroup
            value={preferredBookingMethod}
            onValueChange={setPreferredBookingMethod}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone">Phone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="website" id="website" />
              <Label htmlFor="website">Website</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Server Names</Label>
          <div className="flex gap-2">
            <Input
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              placeholder="Add server name"
              onKeyPress={(e) => e.key === 'Enter' && handleAddServer()}
            />
            <Button 
              type="button" 
              onClick={handleAddServer}
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {serverNames.map((name, index) => (
              <div 
                key={index}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                <span>{name}</span>
                <button
                  onClick={() => handleRemoveServer(index)}
                  className="hover:text-primary/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
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

      {/* Preview Card */}
      {restaurantName && (
        <RestaurantContactCard
          name={restaurantName}
          phoneNumber={phoneNumber}
          websiteUrl={websiteUrl}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          googleMapsUrl={googleMapsUrl}
        />
      )}
    </div>
  );
};
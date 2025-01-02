import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ServerManagementSection } from "./ServerManagementSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  serverNames?: string[];
  menuAnalysis?: any;
}

interface RestaurantInfoSectionProps {
  restaurantInfo: RestaurantInfo;
  setRestaurantInfo: (info: RestaurantInfo) => void;
}

export const RestaurantInfoSection = ({
  restaurantInfo,
  setRestaurantInfo,
}: RestaurantInfoSectionProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const handleInputChange = (field: keyof RestaurantInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestaurantInfo({
      ...restaurantInfo,
      [field]: e.target.value
    });
  };

  const handleServerNamesChange = (names: string[]) => {
    setRestaurantInfo({
      ...restaurantInfo,
      serverNames: names
    });
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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-white rounded-xl shadow-lg"
    >
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Restaurant Information</h2>
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

          <ServerManagementSection
            serverNames={restaurantInfo.serverNames || []}
            onServerNamesChange={handleServerNamesChange}
          />

          <Button onClick={handleSavePreferences} className="w-full">
            Save Restaurant Information
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
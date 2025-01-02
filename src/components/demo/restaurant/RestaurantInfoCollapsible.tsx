import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { BasicInfoSection } from "./BasicInfoSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { ServerManagementSection } from "./ServerManagementSection";
import { RewardSettingsSection } from "./RewardSettingsSection";

interface RestaurantInfoCollapsibleProps {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  serverNames: string[];
  reviewRewardAmount: number;
  tipRewardPercentage: number;
  showSuccess: boolean;
  isSaving: boolean;
  onInfoChange: (field: string, value: string | number) => void;
  onServerNamesChange: (names: string[]) => void;
  onSave: () => void;
}

export const RestaurantInfoCollapsible = ({
  restaurantName,
  googleMapsUrl,
  contactEmail,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  serverNames,
  reviewRewardAmount,
  tipRewardPercentage,
  showSuccess,
  isSaving,
  onInfoChange,
  onServerNamesChange,
  onSave,
}: RestaurantInfoCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Restaurant Information</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <div className="p-6 space-y-6">
          <BasicInfoSection
            restaurantName={restaurantName}
            googleMapsUrl={googleMapsUrl}
            contactEmail={contactEmail}
            onInfoChange={onInfoChange}
            showSuccess={showSuccess}
          />

          <SocialMediaSection
            websiteUrl={websiteUrl}
            facebookUrl={facebookUrl}
            instagramUrl={instagramUrl}
            onInfoChange={onInfoChange}
          />

          <ServerManagementSection
            serverNames={serverNames}
            onServerNamesChange={onServerNamesChange}
          />

          <RewardSettingsSection
            reviewRewardAmount={reviewRewardAmount}
            tipRewardPercentage={tipRewardPercentage}
            onInfoChange={onInfoChange}
          />

          <Button 
            onClick={onSave}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Restaurant Information"}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BasicInfoSection } from "./BasicInfoSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { ServerManagementSection } from "./ServerManagementSection";
import { RewardSettingsSection } from "./RewardSettingsSection";
import { Button } from "@/components/ui/button";
import { RestaurantContactCard } from "../RestaurantContactCard";

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Restaurant Information</h2>
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

      <CollapsibleContent>
        <div className="space-y-8">
          <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
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

            <RewardSettingsSection
              reviewRewardAmount={reviewRewardAmount}
              tipRewardPercentage={tipRewardPercentage}
              onInfoChange={onInfoChange}
            />

            <ServerManagementSection
              serverNames={serverNames}
              onServerNamesChange={onServerNamesChange}
            />

            <Button 
              onClick={onSave}
              disabled={isSaving}
              className={`w-full transition-all duration-300 ${
                showSuccess 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {showSuccess ? (
                <>
                  ✓ Saved Successfully!
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
      </CollapsibleContent>
    </Collapsible>
  );
};
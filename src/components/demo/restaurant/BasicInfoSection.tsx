import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface BasicInfoSectionProps {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  onInfoChange: (field: string, value: string) => void;
  showSuccess: boolean;
}

export const BasicInfoSection = ({
  restaurantName,
  googleMapsUrl,
  contactEmail,
  onInfoChange,
  showSuccess,
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input
          id="restaurantName"
          value={restaurantName}
          onChange={(e) => onInfoChange('restaurantName', e.target.value)}
          placeholder="Enter your restaurant name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
        <Input
          id="googleMapsUrl"
          value={googleMapsUrl}
          onChange={(e) => onInfoChange('googleMapsUrl', e.target.value)}
          placeholder="Paste your Google Maps link"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => onInfoChange('contactEmail', e.target.value)}
          placeholder="Enter restaurant contact email"
        />
      </div>
    </div>
  );
};
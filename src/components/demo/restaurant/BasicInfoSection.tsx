import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface BasicInfoSectionProps {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
  onInfoChange: (field: string, value: string | number) => void;
  showSuccess: boolean;
}

export const BasicInfoSection = ({
  restaurantName,
  googleMapsUrl,
  contactEmail,
  reviewRewardAmount,
  tipRewardPercentage,
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
      <div className="space-y-2">
        <Label htmlFor="reviewRewardAmount">Review Reward Amount (£)</Label>
        <Input
          id="reviewRewardAmount"
          type="number"
          min="0"
          step="0.01"
          value={reviewRewardAmount}
          onChange={(e) => onInfoChange('reviewRewardAmount', parseFloat(e.target.value))}
          placeholder="Enter review reward amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipRewardPercentage">Tip Reward Percentage (%)</Label>
        <Input
          id="tipRewardPercentage"
          type="number"
          min="0"
          max="100"
          step="1"
          value={tipRewardPercentage}
          onChange={(e) => onInfoChange('tipRewardPercentage', parseFloat(e.target.value))}
          placeholder="Enter tip reward percentage"
        />
      </div>
    </div>
  );
};
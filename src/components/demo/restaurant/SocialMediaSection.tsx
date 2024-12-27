import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaSectionProps {
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  onInfoChange: (field: string, value: string) => void;
}

export const SocialMediaSection = ({
  websiteUrl,
  facebookUrl,
  instagramUrl,
  onInfoChange,
}: SocialMediaSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => onInfoChange('websiteUrl', e.target.value)}
          placeholder="Enter your website URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebookUrl">Facebook URL</Label>
        <Input
          id="facebookUrl"
          type="url"
          value={facebookUrl}
          onChange={(e) => onInfoChange('facebookUrl', e.target.value)}
          placeholder="Enter your Facebook page URL"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagramUrl">Instagram URL</Label>
        <Input
          id="instagramUrl"
          type="url"
          value={instagramUrl}
          onChange={(e) => onInfoChange('instagramUrl', e.target.value)}
          placeholder="Enter your Instagram profile URL"
        />
      </div>
    </div>
  );
};
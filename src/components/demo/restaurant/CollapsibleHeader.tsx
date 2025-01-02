import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleHeaderProps {
  isOpen: boolean;
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
}

export const CollapsibleHeader = ({ isOpen, restaurantName, googleMapsUrl, contactEmail }: CollapsibleHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="space-y-1">
        {restaurantName ? (
          <div className="text-sm space-y-1">
            <h3 className="font-medium">{restaurantName}</h3>
            <p className="text-muted-foreground text-xs">
              {contactEmail && `📧 ${contactEmail}`}
              {googleMapsUrl && ` • 📍 Google Maps linked`}
            </p>
          </div>
        ) : (
          <h3 className="font-medium">Restaurant Information</h3>
        )}
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
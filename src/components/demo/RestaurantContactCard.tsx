import { Phone, Globe, Facebook, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantContactCardProps {
  name: string;
  phoneNumber?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
}

export const RestaurantContactCard = ({
  name,
  phoneNumber,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  googleMapsUrl,
}: RestaurantContactCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="space-y-2">
        {phoneNumber && (
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(`tel:${phoneNumber}`, '_blank')}
          >
            <Phone className="h-4 w-4 mr-2" />
            {phoneNumber}
          </Button>
        )}
        {googleMapsUrl && (
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(googleMapsUrl, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Find us
          </Button>
        )}
        {websiteUrl && (
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(websiteUrl, '_blank')}
          >
            <Globe className="h-4 w-4 mr-2" />
            Visit our Website
          </Button>
        )}
        {facebookUrl && (
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(facebookUrl, '_blank')}
          >
            <Facebook className="h-4 w-4 mr-2" />
            Follow us on Facebook
          </Button>
        )}
        {instagramUrl && (
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(instagramUrl, '_blank')}
          >
            <Instagram className="h-4 w-4 mr-2" />
            Follow us on Instagram
          </Button>
        )}
      </div>
    </div>
  );
};
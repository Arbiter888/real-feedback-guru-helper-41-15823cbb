import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewPageUrlSectionProps {
  restaurantName: string | null;
  googleMapsUrl: string | null;
  generatedUrl: string;
}

export const ReviewPageUrlSection = ({
  restaurantName,
  googleMapsUrl,
  generatedUrl,
}: ReviewPageUrlSectionProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Get the current hostname without any trailing colons
  const baseUrl = window.location.origin.replace(/:\/*$/, '');
  const fullUrl = `${baseUrl}${generatedUrl}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: "URL copied!",
        description: "The review page URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the URL manually.",
        variant: "destructive",
      });
    }
  };

  const handleVisitPage = () => {
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="reviewUrl" className="text-sm font-medium text-gray-700">
          Your Review Page URL
        </label>
        <div className="flex gap-2">
          <Input
            id="reviewUrl"
            value={fullUrl}
            readOnly
            className="flex-1"
          />
          <Button
            onClick={handleCopyUrl}
            variant="outline"
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            onClick={handleVisitPage}
            variant="outline"
            className="flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit
          </Button>
        </div>
      </div>
    </div>
  );
};
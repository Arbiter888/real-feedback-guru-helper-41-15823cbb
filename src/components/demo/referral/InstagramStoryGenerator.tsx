import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QRCode, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAndUploadQRCode } from "@/utils/qrCodeUtils";

interface InstagramStoryGeneratorProps {
  referralUrl: string;
  restaurantName: string;
  referrerName: string;
}

export const InstagramStoryGenerator = ({
  referralUrl,
  restaurantName,
  referrerName,
}: InstagramStoryGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateStoryCard = async () => {
    setIsGenerating(true);
    try {
      // Generate QR code for the referral link
      const qrCodeUrl = await generateAndUploadQRCode(referralUrl);

      // Call the edge function to generate the story card
      const { data, error } = await supabase.functions.invoke('generate-story-card', {
        body: {
          qrCodeUrl,
          restaurantName,
          referrerName,
        },
      });

      if (error) throw error;

      setStoryImageUrl(data.imageUrl);
      toast({
        title: "Story card generated!",
        description: "Your Instagram story card is ready to share.",
      });
    } catch (error) {
      console.error('Error generating story card:', error);
      toast({
        title: "Error",
        description: "Failed to generate story card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToInstagram = () => {
    // Open Instagram sharing if on mobile
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && storyImageUrl) {
      window.location.href = `instagram://story-camera`;
    } else {
      // Fallback for desktop: download image
      const link = document.createElement('a');
      link.href = storyImageUrl || '';
      link.download = `${restaurantName}-referral-story.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Share on Instagram</h3>
        <p className="text-sm text-gray-600">
          Generate a beautiful story card to share with your followers
        </p>
      </div>

      {storyImageUrl && (
        <div className="relative aspect-[9/16] w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={storyImageUrl}
            alt="Instagram Story Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={generateStoryCard}
          disabled={isGenerating}
          variant="outline"
          className="w-full"
        >
          <QRCode className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Story Card"}
        </Button>

        {storyImageUrl && (
          <Button
            onClick={shareToInstagram}
            className="w-full"
          >
            <Share className="h-4 w-4 mr-2" />
            Share to Instagram
          </Button>
        )}
      </div>
    </Card>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import { generateAndUploadQRCode } from "@/utils/qrCodeUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const generateUniqueSlug = (baseName: string) => {
  const baseSlug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const uniqueId = nanoid(6);
  return `${baseSlug}-${uniqueId}`;
};

interface CreateReviewPageButtonProps {
  setGeneratedUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setReviewPageId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const CreateReviewPageButton = ({ setGeneratedUrl, setReviewPageId }: CreateReviewPageButtonProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [reviewRewardAmount, setReviewRewardAmount] = useState(10);
  const [tipRewardPercentage, setTipRewardPercentage] = useState(50);
  const { toast } = useToast();

  const handleCreateReviewPage = async () => {
    setIsCreating(true);

    try {
      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      console.log('Loaded preferences:', savedRestaurantInfo);

      if (!savedRestaurantInfo) {
        toast({
          title: "Missing preferences",
          description: "Please set your restaurant preferences first.",
          variant: "destructive",
        });
        return;
      }

      const { 
        restaurantName, 
        googleMapsUrl, 
        contactEmail, 
        serverNames,
      } = JSON.parse(savedRestaurantInfo);
      
      console.log('Parsed contact email:', contactEmail);
      console.log('Server names:', serverNames);
      console.log('Review reward amount:', reviewRewardAmount);
      console.log('Tip reward percentage:', tipRewardPercentage);

      if (!restaurantName || !googleMapsUrl) {
        toast({
          title: "Missing preferences",
          description: "Please set your restaurant preferences first.",
          variant: "destructive",
        });
        return;
      }

      const uniqueSlug = generateUniqueSlug(restaurantName);
      const generatedUrlPath = `/restaurant-review/${uniqueSlug}`;
      const fullUrl = `${window.location.origin}${generatedUrlPath}`;

      const { data, error } = await supabase
        .from('demo_pages')
        .insert([
          {
            restaurant_name: restaurantName,
            google_maps_url: googleMapsUrl,
            contact_email: contactEmail,
            slug: uniqueSlug,
            server_names: serverNames || [],
            review_reward_amount: reviewRewardAmount,
            tip_reward_percentage: tipRewardPercentage
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating review page:', error);
        throw error;
      }

      localStorage.setItem('generatedUrl', generatedUrlPath);
      localStorage.setItem('reviewPageId', data.id);

      setReviewPageId(data.id);
      setGeneratedUrl(generatedUrlPath);

      await generateQRCodeAndPDF(fullUrl, restaurantName, reviewRewardAmount, tipRewardPercentage);

      toast({
        title: "Review page created!",
        description: "Your review page has been created successfully.",
      });

    } catch (error) {
      console.error('Error creating review page:', error);
      toast({
        title: "Error",
        description: "Failed to create review page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const generateQRCodeAndPDF = async (url: string, restaurantName: string, reviewReward: number, tipReward: number) => {
    try {
      const qrCodeUrl = await generateAndUploadQRCode(url);
      setQrCodeUrl(qrCodeUrl);
      localStorage.setItem('qrCodeUrl', qrCodeUrl);
      
      toast({
        title: "QR Code Generated!",
        description: "You can now download the PDF with the QR code.",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reviewReward">Review Reward Amount (£)</Label>
          <Input
            id="reviewReward"
            type="number"
            min="0"
            step="0.01"
            value={reviewRewardAmount}
            onChange={(e) => setReviewRewardAmount(parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipReward">Tip Reward Percentage (%)</Label>
          <Input
            id="tipReward"
            type="number"
            min="0"
            max="100"
            step="1"
            value={tipRewardPercentage}
            onChange={(e) => setTipRewardPercentage(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <Button
        onClick={handleCreateReviewPage}
        disabled={isCreating}
        className="w-full"
      >
        {isCreating ? "Creating..." : "Create Review Page"}
        <Link2 className="ml-2 h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
};
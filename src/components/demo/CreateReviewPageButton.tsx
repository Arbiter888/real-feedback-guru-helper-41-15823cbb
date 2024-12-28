import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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
  const { toast } = useToast();

  const generateQRCodeAndPDF = async (url: string, restaurantName: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url);
      setQrCodeUrl(qrCodeDataUrl);
      
      // Save QR code URL to localStorage for persistence
      localStorage.setItem('qrCodeUrl', qrCodeDataUrl);
      
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

      const { restaurantName, googleMapsUrl, contactEmail, serverNames } = JSON.parse(savedRestaurantInfo);
      console.log('Parsed contact email:', contactEmail);
      console.log('Server names:', serverNames);

      if (!restaurantName || !googleMapsUrl) {
        toast({
          title: "Missing preferences",
          description: "Please set your restaurant preferences first.",
          variant: "destructive",
        });
        return;
      }

      const uniqueSlug = generateUniqueSlug(restaurantName);
      const baseUrl = window.location.origin.replace(/[:\/]+$/, '');
      const fullUrl = `${baseUrl}/${uniqueSlug}`;

      const { data, error } = await supabase
        .from('demo_pages')
        .insert([
          {
            restaurant_name: restaurantName,
            google_maps_url: googleMapsUrl,
            contact_email: contactEmail,
            slug: uniqueSlug,
            server_names: serverNames || []
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating review page:', error);
        throw error;
      }

      // Save the generated URL and review page ID to localStorage
      localStorage.setItem('generatedUrl', `/${uniqueSlug}`);
      localStorage.setItem('reviewPageId', data.id);

      setReviewPageId(data.id);
      setGeneratedUrl(`/${uniqueSlug}`);

      await generateQRCodeAndPDF(fullUrl, restaurantName);

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

  return (
    <div className="space-y-4">
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
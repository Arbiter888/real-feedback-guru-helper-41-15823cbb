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
  const { toast } = useToast();

  const generateQRCodeAndPDF = async (url: string, restaurantName: string) => {
    try {
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(url);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add restaurant name
      pdf.setFontSize(20);
      pdf.text(restaurantName, 20, 20);

      // Add URL text
      pdf.setFontSize(12);
      pdf.text("Scan to share your experience", 20, 40);
      pdf.text(url, 20, 50);

      // Add QR code
      pdf.addImage(qrCodeDataUrl, "PNG", 20, 60, 80, 80);

      // Save the PDF
      pdf.save(`${restaurantName}-review-page.pdf`);

      toast({
        title: "PDF Created!",
        description: "Your review page PDF has been generated with QR code.",
      });
    } catch (error) {
      console.error('Error generating QR code and PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code and PDF.",
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
      // Properly format the base URL by removing any trailing slashes and ensuring no colon is present
      const baseUrl = window.location.origin.replace(/:\/*$/, '').replace(/\/$/, '');
      const fullUrl = `${baseUrl}/${uniqueSlug}`;

      const { data, error } = await supabase
        .from('demo_pages')
        .insert([
          {
            restaurant_name: restaurantName,
            google_maps_url: googleMapsUrl,
            contact_email: contactEmail,
            slug: uniqueSlug,
            server_names: serverNames || [],
            full_url: fullUrl // Store the properly formatted URL
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating review page:', error);
        throw error;
      }

      setReviewPageId(data.id);
      setGeneratedUrl(`/${uniqueSlug}`);

      // Generate QR code and PDF after successful page creation
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
    <Button
      onClick={handleCreateReviewPage}
      disabled={isCreating}
      className="w-full"
    >
      {isCreating ? "Creating..." : "Create Review Page"}
      <Link2 className="ml-2 h-4 w-4 md:h-5 md:w-5" />
    </Button>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

const generateUniqueSlug = (baseName: string) => {
  const baseSlug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const uniqueId = nanoid(6); // Generate a 6-character unique ID
  return `${baseSlug}-${uniqueId}`;
};

interface CreateReviewPageButtonProps {
  setGeneratedUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const CreateReviewPageButton = ({ setGeneratedUrl }: CreateReviewPageButtonProps) => {
  const [isCreating, setIsCreating] = useState(false);
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

      const { restaurantName, googleMapsUrl, contactEmail } = JSON.parse(savedRestaurantInfo);
      console.log('Parsed contact email:', contactEmail);

      if (!restaurantName || !googleMapsUrl) {
        toast({
          title: "Missing preferences",
          description: "Please set your restaurant preferences first.",
          variant: "destructive",
        });
        return;
      }

      const uniqueSlug = generateUniqueSlug(restaurantName);

      const { data, error } = await supabase
        .from('demo_pages')
        .insert([
          {
            restaurant_name: restaurantName,
            google_maps_url: googleMapsUrl,
            contact_email: contactEmail,
            slug: uniqueSlug,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating review page:', error);
        throw error;
      }

      // Set the generated URL to the slug directly
      setGeneratedUrl(`/${uniqueSlug}`);
      
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
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";

interface ReviewPageSectionProps {
  restaurantName: string;
  googleMapsUrl: string;
  generatedUrl: string | null;
  reviewPageId: string | null;
  onUrlGenerated: (url: string) => void;
  onPageCreated: (id: string) => void;
}

export const ReviewPageSection = ({
  restaurantName,
  googleMapsUrl,
  generatedUrl,
  onUrlGenerated,
  onPageCreated,
}: ReviewPageSectionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Create Your Review Page</h2>
        <p className="text-muted-foreground mb-6">
          Start collecting reviews and managing your restaurant's online presence
        </p>
        <CreateReviewPageButton 
          setGeneratedUrl={onUrlGenerated}
          setReviewPageId={onPageCreated}
        />
        
        {generatedUrl && (
          <div className="mt-8">
            <ReviewPageUrlSection
              restaurantName={restaurantName}
              googleMapsUrl={googleMapsUrl}
              generatedUrl={generatedUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};
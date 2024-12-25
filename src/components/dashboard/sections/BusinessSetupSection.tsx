import { RestaurantInfo } from "@/components/demo/RestaurantInfo";
import { CreateReviewPageButton } from "@/components/demo/CreateReviewPageButton";
import { ReviewPageUrlSection } from "@/components/demo/ReviewPageUrlSection";
import { useState } from "react";

export function BusinessSetupSection() {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [reviewPageId, setReviewPageId] = useState<string | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantName: "",
    googleMapsUrl: "",
  });

  const handleRestaurantInfoSaved = (name: string, url: string) => {
    setRestaurantInfo({ restaurantName: name, googleMapsUrl: url });
  };

  return (
    <section id="business-setup" className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Business Information</h2>
        <RestaurantInfo onRestaurantInfoSaved={handleRestaurantInfoSaved} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Create Your Review Page</h2>
          <p className="text-muted-foreground mb-6">
            Start collecting reviews and managing your restaurant's online presence
          </p>
          <CreateReviewPageButton
            setGeneratedUrl={setGeneratedUrl}
            setReviewPageId={setReviewPageId}
          />

          {generatedUrl && (
            <div className="mt-8">
              <ReviewPageUrlSection
                restaurantName={restaurantInfo.restaurantName}
                googleMapsUrl={restaurantInfo.googleMapsUrl}
                generatedUrl={generatedUrl}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
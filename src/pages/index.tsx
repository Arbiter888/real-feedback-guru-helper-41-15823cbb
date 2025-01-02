import { RestaurantHeader } from "@/components/demo/RestaurantHeader";
import { ReviewSection } from "@/components/demo/ReviewSection";
import { useState, useEffect } from "react";
import { AiSurveyWidget } from "@/components/demo/AiSurveyWidget";
import { Footer } from "@/components/Footer";
import { ReviewPageCreationSection } from "@/components/demo/ReviewPageCreationSection";
import { DemoHeroSection } from "@/components/demo/DemoHeroSection";

const Page = () => {
  const [showWidget, setShowWidget] = useState(false);
  const [preferences, setPreferences] = useState<{
    restaurantName: string | null;
    googleMapsUrl: string | null;
  }>({
    restaurantName: null,
    googleMapsUrl: null,
  });

  useEffect(() => {
    // Load preferences from localStorage
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');

    if (savedRestaurantInfo) {
      const { restaurantName, googleMapsUrl } = JSON.parse(savedRestaurantInfo);
      setPreferences({
        restaurantName,
        googleMapsUrl,
      });
    }
  }, []);

  const handleSurveyDemoClick = () => {
    setShowWidget(!showWidget);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full">
        <DemoHeroSection onSurveyDemo={handleSurveyDemoClick} />

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <RestaurantHeader 
            name={preferences.restaurantName || "Demo Restaurant"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ReviewSection />
            <ReviewPageCreationSection 
              restaurantName={preferences.restaurantName}
              googleMapsUrl={preferences.googleMapsUrl}
            />
          </div>
        </div>
      </div>
      <AiSurveyWidget show={showWidget} />
      <Footer />
    </main>
  );
};

export default Page;
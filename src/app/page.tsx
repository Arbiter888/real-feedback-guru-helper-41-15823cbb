'use client'
import { RestaurantHeader } from "@/components/demo/RestaurantHeader";
import { ReviewSection } from "@/components/demo/ReviewSection";
import { useState, useEffect } from "react";
import { AiSurveyWidget } from "@/components/demo/AiSurveyWidget";
import { AiBookingWidget } from "@/components/demo/AiBookingWidget";
import { AiTakeoutWidget } from "@/components/demo/AiTakeoutWidget";
import { Footer } from "@/components/Footer";
import { ReviewPageCreationSection } from "@/components/demo/ReviewPageCreationSection";
import DemoHeroSection from "@/components/demo/DemoHeroSection";

const Page = () => {
  const [showSurveyWidget, setShowSurveyWidget] = useState(false);
  const [showBookingWidget, setShowBookingWidget] = useState(false);
  const [showTakeoutWidget, setShowTakeoutWidget] = useState(false);
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
    setShowSurveyWidget(!showSurveyWidget);
    setShowBookingWidget(false);
    setShowTakeoutWidget(false);
  };

  const handleBookingDemoClick = () => {
    setShowBookingWidget(!showBookingWidget);
    setShowSurveyWidget(false);
    setShowTakeoutWidget(false);
  };

  const handleTakeoutDemoClick = () => {
    setShowTakeoutWidget(!showTakeoutWidget);
    setShowSurveyWidget(false);
    setShowBookingWidget(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <DemoHeroSection 
          onSurveyDemo={handleSurveyDemoClick}
          onBookingDemo={handleBookingDemoClick}
          onTakeoutDemo={handleTakeoutDemoClick}
        />

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
      <AiSurveyWidget show={showSurveyWidget} />
      <AiBookingWidget show={showBookingWidget} />
      <AiTakeoutWidget show={showTakeoutWidget} />
      <Footer />
    </div>
  );
};

export default Page;

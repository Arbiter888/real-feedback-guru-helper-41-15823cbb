import { useEffect, useState } from "react";
import { RestaurantHeader } from "./RestaurantHeader";
import { ReviewSection } from "./ReviewSection";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AiSurveyWidget } from "./AiSurveyWidget";
import { Footer } from "@/components/Footer";

interface RestaurantReviewProps {
  slug: string;
}

export const RestaurantReview = ({ slug }: RestaurantReviewProps) => {
  const [preferences, setPreferences] = useState<{
    restaurant_name: string;
    google_maps_url: string;
    server_names: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiSurvey, setShowAiSurvey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRestaurantReviewPage = async () => {
      try {
        const { data, error } = await supabase
          .from('demo_pages')
          .select('restaurant_name, google_maps_url, server_names')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (data) {
          setPreferences(data);
          localStorage.setItem('restaurantInfo', JSON.stringify({
            restaurantName: data.restaurant_name,
            googleMapsUrl: data.google_maps_url,
            serverNames: data.server_names,
          }));
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading demo page:', err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurantReviewPage();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <div className="container max-w-2xl mx-auto px-4 py-6 flex-grow">
        <RestaurantHeader
          name={preferences.restaurant_name}
          isCustomDemo={true}
        />
        <ReviewSection 
          customRestaurantName={preferences.restaurant_name}
          customGoogleMapsUrl={preferences.google_maps_url}
          customServerNames={preferences.server_names}
          hidePreferences={true}
          onTakeAiSurvey={() => setShowAiSurvey(true)}
        />
      </div>
      <AiSurveyWidget show={showAiSurvey} />
      <Footer />
    </main>
  );
};
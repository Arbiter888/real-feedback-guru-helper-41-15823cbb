import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { CreateReviewPageButton } from "./CreateReviewPageButton";
import { ReviewPageUrlSection } from "./ReviewPageUrlSection";

interface ReviewPageCreationSectionProps {
  restaurantName: string | null;
  googleMapsUrl: string | null;
}

export const ReviewPageCreationSection = ({ restaurantName, googleMapsUrl }: ReviewPageCreationSectionProps) => {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [reviewPageId, setReviewPageId] = useState<string | null>(null);

  // Load saved review page data from localStorage on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('reviewPageUrl');
    const savedId = localStorage.getItem('reviewPageId');
    if (savedUrl) setGeneratedUrl(savedUrl);
    if (savedId) setReviewPageId(savedId);
  }, []);

  // Save review page data to localStorage when generated
  useEffect(() => {
    if (generatedUrl) {
      localStorage.setItem('reviewPageUrl', generatedUrl);
    }
    if (reviewPageId) {
      localStorage.setItem('reviewPageId', reviewPageId);
    }
  }, [generatedUrl, reviewPageId]);

  return (
    <div className="relative">
      <div className="md:sticky md:top-24 space-y-4 md:space-y-6 bg-gradient-to-b from-white via-pink-50 to-pink-100/20 p-6 md:p-8 rounded-xl shadow-lg border border-pink-200">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="bg-primary p-3 rounded-full w-fit mx-auto">
            <Building2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Your Review & Rewards Collection Page
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Generate professional materials to collect reviews & rewards:
          </p>
          <ul className="text-sm md:text-base text-gray-600 max-w-xl mx-auto text-left list-disc pl-8">
            <li>Display the PDF at your counter or entrance</li>
            <li>Add the QR code to receipts and menus</li>
            <li>Place table cards with the QR code at each table</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Make it easy for customers to recognize great service and get rewarded while dining with you.
          </p>
          <div className="space-y-4 text-left border-t border-pink-200 pt-4 mt-4">
            <h3 className="font-semibold text-gray-800">What You'll Get:</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                A beautifully designed review and rewards collection page
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                Professional PDF displays for your venue
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                Customized QR codes with "Get Rewarded for Tips & Reviews" text
              </li>
            </ol>
          </div>
        </div>

        <CreateReviewPageButton 
          setGeneratedUrl={setGeneratedUrl} 
          setReviewPageId={setReviewPageId}
        />

        <ReviewPageUrlSection
          restaurantName={restaurantName}
          googleMapsUrl={googleMapsUrl}
          generatedUrl={generatedUrl}
        />
      </div>
    </div>
  );
};
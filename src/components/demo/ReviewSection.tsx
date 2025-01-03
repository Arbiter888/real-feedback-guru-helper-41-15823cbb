import { Card, CardContent } from "@/components/ui/card";
import { RewardsSection } from "./RewardsSection";
import { ThoughtsStep } from "./steps/ThoughtsStep";
import { UploadStep } from "./steps/UploadStep";
import { RefineStep } from "./steps/RefineStep";
import { ServerSelectionStep } from "./ServerSelectionStep";
import { RestaurantInfo } from "./RestaurantInfo";
import { AiFeedbackSection } from "./AiFeedbackSection";
import { IntroSection } from "./sections/IntroSection";
import { TipJarSection } from "./tips/TipJarSection";
import { useReviewSection } from "@/hooks/useReviewSection";
import { useToast } from "@/hooks/use-toast";

interface ReviewSectionProps {
  customRestaurantName?: string;
  customGoogleMapsUrl?: string;
  customServerNames?: string[];
  hidePreferences?: boolean;
  onTakeAiSurvey?: () => void;
}

export const ReviewSection = ({ 
  customRestaurantName,
  customGoogleMapsUrl,
  customServerNames,
  hidePreferences = false,
  onTakeAiSurvey
}: ReviewSectionProps) => {
  const { toast } = useToast();
  const {
    selectedServer,
    setSelectedServer,
    serverNames,
    reviewText,
    setReviewText,
    refinedReview,
    setRefinedReview,
    analysisResult,
    isRefining,
    isAnalyzing,
    rewardCode,
    googleMapsUrl,
    restaurantName,
    reviewRewardAmount,
    tipRewardPercentage,
    tipAmount,
    tipRewardAmount,
    tipRewardCode,
    handlePreferencesSaved,
    handleReceiptUpload,
    handleRefineReview,
    handleCopyAndRedirect,
    handleTipSelected
  } = useReviewSection(customRestaurantName, customGoogleMapsUrl, customServerNames);

  // Only show tip jar after review is completed (either original or refined)
  const showTipJar = rewardCode && selectedServer && (reviewText || refinedReview);

  return (
    <Card>
      <CardContent className="space-y-8 pt-6">
        {!hidePreferences && (
          <RestaurantInfo 
            onRestaurantInfoSaved={handlePreferencesSaved} 
          />
        )}
        
        <ServerSelectionStep 
          serverNames={serverNames}
          onServerSelect={setSelectedServer}
          selectedServer={selectedServer}
        />

        <IntroSection />
        
        <ThoughtsStep 
          reviewText={reviewText}
          onChange={setReviewText}
          onComplete={() => {
            toast({
              title: "✅ Step 1 Complete!",
              description: "Great! You can now enhance your review or optionally add a receipt photo.",
            });
          }}
        />

        <UploadStep 
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onFileSelect={handleReceiptUpload}
        />

        <RefineStep 
          reviewText={reviewText}
          refinedReview={refinedReview}
          isRefining={isRefining}
          onRefine={handleRefineReview}
          onRefinedReviewChange={setRefinedReview}
          onCopyAndRedirect={handleCopyAndRedirect}
        />

        {showTipJar && (
          <TipJarSection 
            serverName={selectedServer}
            totalAmount={analysisResult?.total_amount}
            tipRewardPercentage={tipRewardPercentage}
            reviewRewardAmount={reviewRewardAmount}
            onTipSelected={handleTipSelected}
          />
        )}

        <RewardsSection 
          rewardCode={rewardCode} 
          hasUploadedReceipt={!!analysisResult}
          customRestaurantName={restaurantName}
          customGoogleMapsUrl={googleMapsUrl}
          reviewRewardAmount={reviewRewardAmount}
          tipRewardCode={tipRewardCode}
          tipAmount={tipAmount}
          tipRewardAmount={tipRewardAmount}
        />

        {onTakeAiSurvey && (
          <AiFeedbackSection onTakeAiSurvey={onTakeAiSurvey} />
        )}
      </CardContent>
    </Card>
  );
};
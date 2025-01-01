import { Card, CardContent } from "@/components/ui/card";
import { RewardsSection } from "./RewardsSection";
import { ThoughtsStep } from "./steps/ThoughtsStep";
import { UploadStep } from "./steps/UploadStep";
import { RefineStep } from "./steps/RefineStep";
import { ServerSelectionStep } from "./steps/ServerSelectionStep";
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
    handlePreferencesSaved,
    handleReceiptUpload,
    handleRefineReview,
    handleCopyAndRedirect
  } = useReviewSection(customRestaurantName, customGoogleMapsUrl, customServerNames);

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

        {analysisResult && selectedServer && (
          <TipJarSection 
            serverName={selectedServer}
            totalAmount={analysisResult.total_amount}
            tipRewardPercentage={tipRewardPercentage}
            reviewRewardAmount={reviewRewardAmount}
          />
        )}

        <RewardsSection 
          rewardCode={rewardCode} 
          hasUploadedReceipt={!!analysisResult}
          customRestaurantName={restaurantName}
          customGoogleMapsUrl={googleMapsUrl}
          reviewRewardAmount={reviewRewardAmount}
        />

        {onTakeAiSurvey && (
          <AiFeedbackSection onTakeAiSurvey={onTakeAiSurvey} />
        )}
      </CardContent>
    </Card>
  );
};
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RewardsSection } from "./RewardsSection";
import { ThoughtsStep } from "./steps/ThoughtsStep";
import { UploadStep } from "./steps/UploadStep";
import { RefineStep } from "./steps/RefineStep";
import { ServerSelectionStep } from "./steps/ServerSelectionStep";
import { RestaurantInfo } from "./RestaurantInfo";
import { nanoid } from 'nanoid';
import { AiFeedbackSection } from "./AiFeedbackSection";

interface ReviewSectionProps {
  customRestaurantName?: string;
  customGoogleMapsUrl?: string;
  hidePreferences?: boolean;
  onTakeAiSurvey?: () => void;
}

export const ReviewSection = ({ 
  customRestaurantName,
  customGoogleMapsUrl,
  hidePreferences = false,
  onTakeAiSurvey
}: ReviewSectionProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [refinedReview, setRefinedReview] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(customGoogleMapsUrl || "https://maps.app.goo.gl/Nx23mQHet4TBfctJ6");
  const [restaurantName, setRestaurantName] = useState(customRestaurantName || "The Local Kitchen & Bar");
  const { toast } = useToast();

  const handlePreferencesSaved = (name: string, url: string) => {
    setRestaurantName(name);
    setGoogleMapsUrl(url);
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to Supabase storage...');
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('review_photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('review_photos')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      console.log('Calling analyze-receipt function...');
      const { data, error } = await supabase.functions.invoke('analyze-receipt', {
        body: { imageUrl: publicUrl },
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }
      console.log('Analysis result:', data);

      setAnalysisResult(data.analysis);
      toast({
        title: "✅ Receipt Added!",
        description: "Receipt uploaded and analyzed successfully.",
      });
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast({
        title: "Error",
        description: "Failed to analyze receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefineReview = async () => {
    if (!reviewText.trim()) {
      toast({
        title: "Review required",
        description: "Please write your thoughts before refining.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRefining(true);
      const { data, error } = await supabase.functions.invoke('refine-review', {
        body: { 
          review: reviewText,
          receiptData: analysisResult || null,
          restaurantName: restaurantName // Pass the restaurant name to the function
        },
      });

      if (error) throw error;
      
      setRefinedReview(data.refinedReview);
      toast({
        title: "✅ Review Enhanced!",
        description: "Your review has been professionally enhanced. Feel free to edit it further!",
      });
    } catch (error) {
      console.error('Error refining review:', error);
      toast({
        title: "Error",
        description: "Failed to refine review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyAndRedirect = () => {
    const finalReview = refinedReview || reviewText;
    navigator.clipboard.writeText(finalReview);
    window.open(googleMapsUrl, '_blank');
    // Generate a unique 8-character reward code
    const uniqueCode = nanoid(8);
    setRewardCode(uniqueCode);
    toast({
      title: "Review copied!",
      description: "Opening Google Reviews in a new tab. Please paste your review there.",
    });
  };

  const handleStep1Complete = () => {
    toast({
      title: "✅ Step 1 Complete!",
      description: "Great! You can now enhance your review or optionally add a receipt photo.",
    });
  };

  return (
    <Card>
      <CardContent className="space-y-8 pt-6">
        {!hidePreferences && (
          <RestaurantInfo onRestaurantInfoSaved={handlePreferencesSaved} />
        )}
        
        <div className="text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium text-primary">
              Get Your Reward Today! 🎁
            </p>
            <div className="text-gray-600">
              <p>Share your experience and get rewarded in 3 simple steps:</p>
              <p>1. Write your review below</p>
              <p>2. Add your receipt to better personalise your review</p>
              <p>3. Post it on Google and show it to your server</p>
              <p className="text-primary mt-2">Sign up to EatUP! for another reward for your second visit (more information below)</p>
            </div>
          </div>
        </div>

        <ServerSelectionStep onServerSelect={setSelectedServer} />

        <ThoughtsStep 
          reviewText={reviewText}
          onChange={setReviewText}
          onComplete={handleStep1Complete}
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

        <div className="pt-6">
          <RewardsSection 
            rewardCode={rewardCode} 
            hasUploadedReceipt={!!analysisResult}
            customRestaurantName={restaurantName}
            customGoogleMapsUrl={googleMapsUrl}
          />
        </div>

        {onTakeAiSurvey && (
          <AiFeedbackSection onTakeAiSurvey={onTakeAiSurvey} />
        )}
      </CardContent>
    </Card>
  );
};
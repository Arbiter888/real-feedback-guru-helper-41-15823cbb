import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueRewardCode } from "@/utils/rewardCodeUtils";
import { saveReviewData } from "@/components/demo/rewards/ReviewDataManager";

export const useReviewHandlers = (state: any) => {
  const { toast } = useToast();

  const handlePreferencesSaved = (
    name: string,
    url: string,
    email: string,
    updatedServerNames?: string[],
    newReviewRewardAmount?: number,
    newTipRewardPercentage?: number
  ) => {
    console.log("Preferences saved with server names:", updatedServerNames);
    state.setRestaurantName(name);
    state.setGoogleMapsUrl(url);
    if (updatedServerNames) {
      state.setServerNames(updatedServerNames);
    }
    if (newReviewRewardAmount) {
      state.setReviewRewardAmount(newReviewRewardAmount);
    }
    if (newTipRewardPercentage) {
      state.setTipRewardPercentage(newTipRewardPercentage);
    }
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      state.setIsAnalyzing(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('review_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('review_photos')
        .getPublicUrl(filePath);

      const { data, error } = await supabase.functions.invoke('analyze-receipt', {
        body: { imageUrl: publicUrl },
      });

      if (error) throw error;

      state.setAnalysisResult(data.analysis);
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
      state.setIsAnalyzing(false);
    }
  };

  const handleRefineReview = async () => {
    if (!state.reviewText.trim()) {
      toast({
        title: "Review required",
        description: "Please write your thoughts before refining.",
        variant: "destructive",
      });
      return;
    }

    try {
      state.setIsRefining(true);
      const { data, error } = await supabase.functions.invoke('refine-review', {
        body: { 
          review: state.reviewText,
          receiptData: state.analysisResult || null,
          restaurantName: state.restaurantName,
          serverName: state.selectedServer
        },
      });

      if (error) throw error;
      
      state.setRefinedReview(data.refinedReview);
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
      state.setIsRefining(false);
    }
  };

  const handleTipSelected = async (amount: number) => {
    state.setTipAmount(amount);
    const rewardAmount = amount * (state.tipRewardPercentage / 100);
    state.setTipRewardAmount(rewardAmount);
    state.setTipRewardCode(`TIP${amount}BACK`);
  };

  const handleCopyAndRedirect = async () => {
    const finalReview = state.refinedReview || state.reviewText;
    navigator.clipboard.writeText(finalReview);
    window.open(state.googleMapsUrl, '_blank');
    
    try {
      const uniqueCode = await generateUniqueRewardCode();
      state.setRewardCode(uniqueCode);

      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      let restaurantInfo = null;
      if (savedRestaurantInfo) {
        restaurantInfo = JSON.parse(savedRestaurantInfo);
      }

      try {
        const { data: listData, error: listError } = await supabase
          .rpc('get_or_create_restaurant_email_list', {
            restaurant_name: state.restaurantName
          });

        if (listError) throw listError;

        localStorage.setItem('reviewData', JSON.stringify({
          reviewText: state.reviewText?.trim() || '',
          refinedReview: state.refinedReview?.trim(),
          analysisResult: state.analysisResult,
          serverName: state.selectedServer?.trim(),
          rewardCode: uniqueCode,
          googleMapsUrl: state.googleMapsUrl,
          restaurantName: state.restaurantName,
          restaurantInfo
        }));

        await saveReviewData('', listData, {
          reviewText: state.reviewText?.trim() || '',
          refinedReview: state.refinedReview?.trim(),
          analysisResult: state.analysisResult,
          serverName: state.selectedServer?.trim(),
          rewardCode: uniqueCode,
          googleMapsUrl: state.googleMapsUrl,
          restaurantName: state.restaurantName,
          restaurantInfo
        });

        toast({
          title: "Review copied!",
          description: "Opening Google Reviews in a new tab. Please paste your review there.",
        });
      } catch (error) {
        console.error('Error saving to CRM:', error);
        toast({
          title: "Error",
          description: "Failed to save review data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating unique code:', error);
      toast({
        title: "Error",
        description: "Failed to generate reward code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handlePreferencesSaved,
    handleReceiptUpload,
    handleRefineReview,
    handleCopyAndRedirect,
    handleTipSelected,
  };
};
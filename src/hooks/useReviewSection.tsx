import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueRewardCode } from "@/utils/rewardCodeUtils";
import { saveReviewData } from "@/components/demo/rewards/ReviewDataManager";

export const useReviewSection = (
  customRestaurantName?: string,
  customGoogleMapsUrl?: string,
  customServerNames?: string[]
) => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [serverNames, setServerNames] = useState<string[]>(customServerNames || []);
  const [reviewText, setReviewText] = useState("");
  const [refinedReview, setRefinedReview] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    customGoogleMapsUrl || "https://maps.app.goo.gl/Nx23mQHet4TBfctJ6"
  );
  const [restaurantName, setRestaurantName] = useState(
    customRestaurantName || "The Local Kitchen & Bar"
  );
  const { toast } = useToast();

  useEffect(() => {
    console.log("Loading server names from localStorage");
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const { serverNames: savedServerNames } = JSON.parse(savedRestaurantInfo);
      if (Array.isArray(savedServerNames)) {
        console.log("Found server names:", savedServerNames);
        setServerNames(savedServerNames);
      }
    }
  }, []);

  const handlePreferencesSaved = (
    name: string,
    url: string,
    email: string,
    updatedServerNames?: string[]
  ) => {
    console.log("Preferences saved with server names:", updatedServerNames);
    setRestaurantName(name);
    setGoogleMapsUrl(url);
    if (updatedServerNames) {
      setServerNames(updatedServerNames);
    }
  };

  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
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
          restaurantName,
          serverName: selectedServer
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

  const handleCopyAndRedirect = async () => {
    const finalReview = refinedReview || reviewText;
    navigator.clipboard.writeText(finalReview);
    window.open(googleMapsUrl, '_blank');
    
    try {
      const uniqueCode = await generateUniqueRewardCode();
      setRewardCode(uniqueCode);

      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      let restaurantInfo = null;
      if (savedRestaurantInfo) {
        restaurantInfo = JSON.parse(savedRestaurantInfo);
      }

      try {
        const { data: listData, error: listError } = await supabase
          .rpc('get_or_create_restaurant_email_list', {
            restaurant_name: restaurantName
          });

        if (listError) throw listError;

        localStorage.setItem('reviewData', JSON.stringify({
          reviewText: reviewText?.trim() || '',
          refinedReview: refinedReview?.trim(),
          analysisResult,
          serverName: selectedServer?.trim(),
          rewardCode: uniqueCode,
          googleMapsUrl,
          restaurantName,
          restaurantInfo
        }));

        await saveReviewData('', listData, {
          reviewText: reviewText?.trim() || '',
          refinedReview: refinedReview?.trim(),
          analysisResult,
          serverName: selectedServer?.trim(),
          rewardCode: uniqueCode,
          googleMapsUrl,
          restaurantName,
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
    handlePreferencesSaved,
    handleReceiptUpload,
    handleRefineReview,
    handleCopyAndRedirect
  };
};
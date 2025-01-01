import { useState, useEffect } from "react";

export const useReviewState = (
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
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [tipRewardAmount, setTipRewardAmount] = useState<number | null>(null);
  const [tipRewardCode, setTipRewardCode] = useState<string | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    customGoogleMapsUrl || "https://maps.app.goo.gl/Nx23mQHet4TBfctJ6"
  );
  const [restaurantName, setRestaurantName] = useState(
    customRestaurantName || "The Local Kitchen & Bar"
  );
  const [reviewRewardAmount, setReviewRewardAmount] = useState(10);
  const [tipRewardPercentage, setTipRewardPercentage] = useState(50);

  useEffect(() => {
    console.log("Loading server names from localStorage");
    const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
    if (savedRestaurantInfo) {
      const { 
        serverNames: savedServerNames,
        reviewRewardAmount: savedRewardAmount,
        tipRewardPercentage: savedTipPercentage
      } = JSON.parse(savedRestaurantInfo);
      
      if (Array.isArray(savedServerNames)) {
        console.log("Found server names:", savedServerNames);
        setServerNames(savedServerNames);
      }
      
      if (savedRewardAmount) {
        setReviewRewardAmount(savedRewardAmount);
      }
      
      if (savedTipPercentage) {
        setTipRewardPercentage(savedTipPercentage);
      }
    }
  }, []);

  return {
    selectedServer,
    setSelectedServer,
    serverNames,
    setServerNames,
    reviewText,
    setReviewText,
    refinedReview,
    setRefinedReview,
    analysisResult,
    setAnalysisResult,
    isRefining,
    setIsRefining,
    isAnalyzing,
    setIsAnalyzing,
    rewardCode,
    setRewardCode,
    tipAmount,
    setTipAmount,
    tipRewardAmount,
    setTipRewardAmount,
    tipRewardCode,
    setTipRewardCode,
    googleMapsUrl,
    setGoogleMapsUrl,
    restaurantName,
    setRestaurantName,
    reviewRewardAmount,
    setReviewRewardAmount,
    tipRewardPercentage,
    setTipRewardPercentage,
  };
};
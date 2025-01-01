export interface ReviewData {
  id?: string;
  reviewText: string;
  refinedReview?: string;
  serverName?: string;
  photoUrl?: string;
  rewardCode: string;
  googleMapsUrl?: string;
  restaurantName?: string;
  reviewRewardAmount?: number;
  tipRewardPercentage?: number;
  restaurantInfo?: {
    restaurantName?: string;
    googleMapsUrl?: string;
    serverNames?: string[];
  };
  receiptData?: {
    total_amount?: number;
    items?: any[];
    tip_amount?: number;
  };
}

export const saveReviewData = (data: ReviewData) => {
  localStorage.setItem('reviewData', JSON.stringify(data));
};

export const loadReviewData = (): ReviewData | null => {
  const savedData = localStorage.getItem('reviewData');
  return savedData ? JSON.parse(savedData) : null;
};
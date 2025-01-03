export interface WelcomeEmailRequest {
  to: string;
  firstName: string;
  rewardCode: string | null;
  tipRewardCode: string | null;
  tipAmount: number | null;
  tipReward: number | null;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
}

export interface ReferralCode {
  code: string;
  qrCodeUrl: string;
  referralUrl: string;
}
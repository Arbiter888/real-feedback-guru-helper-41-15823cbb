import { EmailSignup } from "./EmailSignup";

interface EmailCaptureProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
}

export const EmailCapture = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName 
}: EmailCaptureProps) => {
  return (
    <EmailSignup 
      rewardCode={rewardCode}
      customGoogleMapsUrl={customGoogleMapsUrl}
      customRestaurantName={customRestaurantName}
    />
  );
};
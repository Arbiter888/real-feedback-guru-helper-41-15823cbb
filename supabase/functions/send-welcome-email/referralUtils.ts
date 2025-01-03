import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export const generateReferralCode = async (
  supabase: ReturnType<typeof createClient>,
  firstName: string,
  email: string,
  restaurantInfo: any,
  origin: string
) => {
  console.log('Generating referral code for:', email, 'at restaurant:', restaurantInfo.restaurantName);

  // Generate referral code
  const code = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
  const referralUrl = `${origin}/referral/${code}`;
  
  // Generate QR code using existing edge function
  const { data: qrData } = await supabase.functions.invoke('generate-qr-code', {
    body: { url: referralUrl }
  });

  // Create referral code record
  const { error: referralError } = await supabase
    .from('referral_codes')
    .insert({
      referrer_name: firstName,
      referrer_email: email,
      restaurant_name: restaurantInfo.restaurantName,
      code: code,
      qr_code_url: qrData.qrCodeUrl,
      referral_url: referralUrl,
      restaurant_info: restaurantInfo,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
    });

  if (referralError) throw referralError;

  return {
    code,
    qrCodeUrl: qrData.qrCodeUrl,
    referralUrl
  };
};
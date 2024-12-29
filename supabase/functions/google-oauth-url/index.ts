// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// @ts-ignore
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
// @ts-ignore
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking OAuth credentials...");
    if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET) {
      console.error("Missing required OAuth credentials");
      throw new Error("Missing Google OAuth credentials. Please configure GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in the Supabase Edge Function secrets.");
    }

    const { redirectUrl } = await req.json();
    console.log("Received redirect URL:", redirectUrl);

    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email"
    );

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUrl
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    console.log("Generated OAuth URL (client_id hidden):", url.replace(GOOGLE_OAUTH_CLIENT_ID, "CLIENT_ID_HIDDEN"));

    return new Response(JSON.stringify({ url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in google-oauth-url function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
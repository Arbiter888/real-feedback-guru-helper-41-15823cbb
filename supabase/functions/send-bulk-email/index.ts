import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  listId: string;
  subject: string;
  htmlContent: string;
  fromName?: string;
  fromEmail?: string;
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listId, subject, htmlContent, fromName = "EatUP!", fromEmail = "hello@eatup.co" }: EmailRequest = await req.json();

    // Fetch email contacts for the list
    const { data: contacts, error: fetchError } = await supabase
      .from("email_contacts")
      .select("email, first_name, last_name")
      .eq("list_id", listId);

    if (fetchError) {
      throw new Error(`Error fetching contacts: ${fetchError.message}`);
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No contacts found in this list" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send emails in batches of 10 to avoid rate limits
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < contacts.length; i += batchSize) {
      batches.push(contacts.slice(i, i + batchSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (const batch of batches) {
      const promises = batch.map(async (contact) => {
        try {
          // Personalize email content if needed
          let personalizedHtml = htmlContent
            .replace(/{{first_name}}/g, contact.first_name || "there")
            .replace(/{{last_name}}/g, contact.last_name || "");

          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: `${fromName} <${fromEmail}>`,
              to: [contact.email],
              subject: subject,
              html: personalizedHtml,
            }),
          });

          if (res.ok) {
            successCount++;
          } else {
            errorCount++;
            console.error(`Failed to send email to ${contact.email}`);
          }
        } catch (error) {
          errorCount++;
          console.error(`Error sending email to ${contact.email}:`, error);
        }
      });

      await Promise.all(promises);
      // Add a small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${successCount} emails successfully. ${errorCount} failed.`,
        successCount,
        errorCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
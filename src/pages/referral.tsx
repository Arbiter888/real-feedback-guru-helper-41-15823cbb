import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Gift, Loader2, Quote } from "lucide-react";

export default function ReferralPage() {
  const { code } = useParams();
  const [referralData, setReferralData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadReferralData = async () => {
      try {
        const { data, error } = await supabase
          .from('referral_codes')
          .select(`
            *,
            reviews (
              review_text,
              refined_review
            )
          `)
          .eq('code', code)
          .single();

        if (error) throw error;
        setReferralData(data);
      } catch (error) {
        console.error('Error loading referral:', error);
        toast({
          title: "Error",
          description: "Failed to load referral information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      loadReferralData();
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const voucherCode = `WELCOME-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
      
      const { error } = await supabase
        .from('referral_signups')
        .insert({
          referral_code_id: referralData.id,
          referee_name: name,
          referee_email: email,
          voucher_code: voucherCode
        });

      if (error) throw error;

      // Update total referrals count
      await supabase
        .from('referral_codes')
        .update({ total_referrals: referralData.total_referrals + 1 })
        .eq('id', referralData.id);

      toast({
        title: "Welcome voucher created!",
        description: "Check your email for your special welcome offer.",
      });

      // TODO: Send welcome email with voucher
    } catch (error) {
      console.error('Error creating signup:', error);
      toast({
        title: "Error",
        description: "Failed to create welcome voucher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-red-600">Invalid Referral Code</h1>
          <p className="text-gray-600 mt-2">This referral link appears to be invalid or has expired.</p>
        </Card>
      </div>
    );
  }

  const review = referralData.reviews?.refined_review || referralData.reviews?.review_text;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Card className="max-w-md mx-auto p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {referralData.referrer_name} thinks you'll love {referralData.restaurant_name}!
          </h1>
          
          {review && (
            <Card className="bg-white p-4 mt-4 space-y-2">
              <div className="flex items-start gap-2">
                <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-gray-700 italic">"{review}"</p>
                  <p className="text-sm text-primary font-medium">- {referralData.referrer_name}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h2 className="font-semibold text-primary mb-2">Join us for your first visit and receive:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                A special welcome voucher
              </li>
              <li className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Exclusive first-time visitor perks
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your voucher...
                </>
              ) : (
                "Get Your Welcome Voucher"
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center">
            Valid for 30 days from signup
          </p>
        </div>
      </Card>
    </div>
  );
};
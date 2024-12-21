import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MetricsOverview } from "./analytics/MetricsOverview";
import { ReviewsTable } from "./analytics/ReviewsTable";
import { AnalyticsChart } from "./analytics/AnalyticsChart";
import { Json } from "@/integrations/supabase/types";

interface AnalyticsData {
  page_views: number;
  qr_code_scans: number;
  link_clicks: number;
  review_submissions: number;
  receipts_uploaded: number;
  reviews_submitted: number;
  avg_review_length: number;
  total_refined_reviews: number;
  last_viewed_at: string | null;
}

interface ReceiptData {
  total_amount: number;
  items: Array<{ name: string; price: number }>;
}

interface Review {
  id: string;
  review_text: string;
  created_at: string;
  refined_review?: string | null;
  receipt_data?: ReceiptData | null;
  business_name: string;
  photo_url: string | null;
  server_name: string | null;
  status: string | null;
  unique_code: string;
  review_page_id: string | null;
}

const defaultAnalytics: AnalyticsData = {
  page_views: 0,
  qr_code_scans: 0,
  link_clicks: 0,
  review_submissions: 0,
  receipts_uploaded: 0,
  reviews_submitted: 0,
  avg_review_length: 0,
  total_refined_reviews: 0,
  last_viewed_at: null,
};

export const ReviewPageAnalytics = ({ reviewPageId }: { reviewPageId: string }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!reviewPageId) {
        setAnalytics(defaultAnalytics);
        return;
      }

      try {
        // Fetch analytics data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('review_page_analytics')
          .select('*')
          .eq('review_page_id', reviewPageId)
          .maybeSingle();

        if (analyticsError) {
          console.error('Error fetching analytics:', analyticsError);
          return;
        }

        setAnalytics(analyticsData || defaultAnalytics);

        // Fetch reviews data
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('review_page_id', reviewPageId)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          return;
        }

        // Parse receipt_data JSON for each review
        const parsedReviews = (reviewsData || []).map(review => ({
          ...review,
          receipt_data: review.receipt_data ? (review.receipt_data as ReceiptData) : null
        }));

        setReviews(parsedReviews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAnalytics();

    // Set up real-time subscription
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_page_analytics',
          filter: `review_page_id=eq.${reviewPageId}`,
        },
        (payload) => {
          console.log('Analytics update received:', payload);
          if (payload.new) {
            setAnalytics(payload.new as AnalyticsData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reviewPageId]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Review Page Analytics</h2>
      
      <MetricsOverview analytics={analytics} />

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Review Details</h3>
        <ReviewsTable reviews={reviews} />
      </div>

      <AnalyticsChart analytics={analytics} />

      {analytics.last_viewed_at && (
        <p className="text-sm text-gray-500 mt-4">
          Last viewed: {new Date(analytics.last_viewed_at).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
};
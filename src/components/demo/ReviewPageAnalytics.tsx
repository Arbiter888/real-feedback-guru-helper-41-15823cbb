import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MetricsOverview } from "./analytics/MetricsOverview";
import { ReviewsTable } from "./analytics/ReviewsTable";
import { AnalyticsChart } from "./analytics/AnalyticsChart";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type ReviewFromDB = Database['public']['Tables']['reviews']['Row'];

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

interface Review {
  id: string;
  review_text: string;
  created_at: string;
  refined_review?: string | null;
  receipt_data?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  } | null;
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

const transformReview = (review: ReviewFromDB): Review => {
  let parsedReceiptData = null;
  if (review.receipt_data) {
    try {
      // Ensure the receipt_data matches our expected format
      const data = review.receipt_data as any;
      if (data.total_amount && Array.isArray(data.items)) {
        parsedReceiptData = {
          total_amount: Number(data.total_amount),
          items: data.items.map((item: any) => ({
            name: String(item.name),
            price: Number(item.price)
          }))
        };
      }
    } catch (error) {
      console.error('Error parsing receipt data:', error);
    }
  }

  return {
    id: review.id,
    review_text: review.review_text,
    created_at: review.created_at,
    refined_review: review.refined_review,
    receipt_data: parsedReceiptData,
    business_name: review.business_name,
    photo_url: review.photo_url,
    server_name: review.server_name,
    status: review.status,
    unique_code: review.unique_code,
    review_page_id: review.review_page_id,
  };
};

export const ReviewPageAnalytics = ({ reviewPageId }: { reviewPageId: string }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!reviewPageId) {
        setError("No review page ID provided");
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
          throw analyticsError;
        }

        if (analyticsData) {
          setAnalytics(analyticsData);
        }

        // Fetch reviews data
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('review_page_id', reviewPageId)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          throw reviewsError;
        }

        // Transform the reviews data to match our expected format
        const transformedReviews = (reviewsData || []).map(transformReview);
        setReviews(transformedReviews);
        setError(null);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError("Failed to load analytics data");
        toast({
          title: "Error loading analytics",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    };

    fetchAnalytics();

    // Set up real-time subscription for analytics updates
    const analyticsChannel = supabase
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

    // Set up real-time subscription for new reviews
    const reviewsChannel = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `review_page_id=eq.${reviewPageId}`,
        },
        (payload) => {
          console.log('New review received:', payload);
          if (payload.new) {
            const transformedReview = transformReview(payload.new as ReviewFromDB);
            setReviews(prev => [transformedReview, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(analyticsChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [reviewPageId, toast]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
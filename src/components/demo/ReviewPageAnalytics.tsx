import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, MessageSquare, QrCode, MousePointer, Receipt, FileText, Wand2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  refined_review?: string;
  receipt_data?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
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

        setReviews(reviewsData || []);
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

  const chartData = [
    { name: 'Page Views', value: analytics.page_views, icon: Eye },
    { name: 'QR Scans', value: analytics.qr_code_scans, icon: QrCode },
    { name: 'Link Clicks', value: analytics.link_clicks, icon: MousePointer },
    { name: 'Reviews', value: analytics.reviews_submitted, icon: MessageSquare },
    { name: 'Receipts', value: analytics.receipts_uploaded, icon: Receipt },
    { name: 'AI Reviews', value: analytics.total_refined_reviews, icon: Wand2 },
  ];

  const formatMetric = (value: number) => {
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Review Page Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {chartData.map((item) => (
          <Card key={item.name} className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.name}</p>
                <p className="text-2xl font-semibold">{formatMetric(item.value)}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Average Review Length</p>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <p className="text-lg font-semibold">
                {formatMetric(analytics.avg_review_length)} characters
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Review Details</h3>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Original Review</TableHead>
                <TableHead>AI Enhanced Review</TableHead>
                <TableHead>Receipt Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(review.created_at)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.review_text}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.refined_review || 'Not enhanced'}
                  </TableCell>
                  <TableCell>
                    {review.receipt_data ? (
                      <div className="text-sm">
                        <p>Total: ${review.receipt_data.total_amount}</p>
                        <p className="text-xs text-gray-500">
                          {review.receipt_data.items.length} items
                        </p>
                      </div>
                    ) : (
                      'No receipt'
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No reviews yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#E94E87" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {analytics.last_viewed_at && (
        <p className="text-sm text-gray-500 mt-4">
          Last viewed: {new Date(analytics.last_viewed_at).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
};
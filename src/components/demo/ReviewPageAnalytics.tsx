import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, MessageSquare, QrCode, MousePointer } from "lucide-react";

interface AnalyticsData {
  page_views: number;
  qr_code_scans: number;
  link_clicks: number;
  review_submissions: number;
  last_viewed_at: string | null;
}

export const ReviewPageAnalytics = ({ reviewPageId }: { reviewPageId: string }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data, error } = await supabase
        .from('review_page_analytics')
        .select('*')
        .eq('review_page_id', reviewPageId)
        .single();

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      setAnalytics(data);
    };

    fetchAnalytics();
  }, [reviewPageId]);

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const chartData = [
    { name: 'Page Views', value: analytics.page_views, icon: Eye },
    { name: 'QR Scans', value: analytics.qr_code_scans, icon: QrCode },
    { name: 'Link Clicks', value: analytics.link_clicks, icon: MousePointer },
    { name: 'Reviews', value: analytics.review_submissions, icon: MessageSquare },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Review Page Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {chartData.map((item) => (
          <Card key={item.name} className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.name}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
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
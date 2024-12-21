import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, MessageSquare, QrCode, MousePointer, Receipt, Wand2, LucideIcon } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  icon: LucideIcon;
}

interface AnalyticsChartProps {
  analytics: {
    page_views: number;
    qr_code_scans: number;
    link_clicks: number;
    reviews_submitted: number;
    receipts_uploaded: number;
    total_refined_reviews: number;
  };
}

export const AnalyticsChart = ({ analytics }: AnalyticsChartProps) => {
  const chartData: ChartData[] = [
    { name: 'Page Views', value: analytics.page_views, icon: Eye },
    { name: 'QR Scans', value: analytics.qr_code_scans, icon: QrCode },
    { name: 'Link Clicks', value: analytics.link_clicks, icon: MousePointer },
    { name: 'Reviews', value: analytics.reviews_submitted, icon: MessageSquare },
    { name: 'Receipts', value: analytics.receipts_uploaded, icon: Receipt },
    { name: 'AI Reviews', value: analytics.total_refined_reviews, icon: Wand2 },
  ];

  return (
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
  );
};
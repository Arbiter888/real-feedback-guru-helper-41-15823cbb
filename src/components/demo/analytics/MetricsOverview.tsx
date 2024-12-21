import { Eye, MessageSquare, QrCode, MousePointer, Receipt, Wand2 } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface MetricsOverviewProps {
  analytics: {
    page_views: number;
    qr_code_scans: number;
    link_clicks: number;
    reviews_submitted: number;
    receipts_uploaded: number;
    total_refined_reviews: number;
    avg_review_length: number;
  };
}

export const MetricsOverview = ({ analytics }: MetricsOverviewProps) => {
  const metrics = [
    { title: 'Page Views', value: analytics.page_views, Icon: Eye },
    { title: 'QR Scans', value: analytics.qr_code_scans, Icon: QrCode },
    { title: 'Link Clicks', value: analytics.link_clicks, Icon: MousePointer },
    { title: 'Reviews', value: analytics.reviews_submitted, Icon: MessageSquare },
    { title: 'Receipts', value: analytics.receipts_uploaded, Icon: Receipt },
    { title: 'AI Reviews', value: analytics.total_refined_reviews, Icon: Wand2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          Icon={metric.Icon}
        />
      ))}
      
      <Card className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Average Review Length</p>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <p className="text-lg font-semibold">
              {analytics.avg_review_length.toLocaleString()} characters
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
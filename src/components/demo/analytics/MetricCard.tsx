import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
}

export const MetricCard = ({ title, value, Icon }: MetricCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
};
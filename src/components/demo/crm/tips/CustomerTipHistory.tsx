import { TipMetadata } from "@/types/tip";
import { Card } from "@/components/ui/card";
import { formatDistance } from "date-fns";

interface CustomerTipHistoryProps {
  tips: TipMetadata;
}

export const CustomerTipHistory = ({ tips }: CustomerTipHistoryProps) => {
  if (!tips || Object.keys(tips).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tip History</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(tips).map(([voucherCode, tip]) => (
          <Card key={voucherCode} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">£{tip.tip_amount} tip to {tip.server_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistance(new Date(tip.tip_date), new Date(), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  £{tip.voucher_amount} reward
                </p>
                <p className={`text-sm ${tip.voucher_status === 'used' ? 'text-muted-foreground' : 'text-primary'}`}>
                  {tip.voucher_status === 'used' ? 'Used' : 'Available'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Voucher code: {voucherCode}
            </p>
            {tip.voucher_used_at && (
              <p className="text-sm text-muted-foreground">
                Used {formatDistance(new Date(tip.voucher_used_at), new Date(), { addSuffix: true })}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
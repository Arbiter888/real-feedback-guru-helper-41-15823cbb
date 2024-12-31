// Define types locally instead of importing from frontend
interface TipVoucherMetadata {
  tip_amount: number;
  server_name: string;
  tip_date: string;
  voucher_amount: number;
  voucher_code: string;
  voucher_status: string;
  voucher_used_at: string | null;
  expires_at: string;
}

interface TipMetadata {
  [voucherCode: string]: TipVoucherMetadata;
}

export function formatTipHistory(tips: TipMetadata): string {
  if (!tips || Object.keys(tips).length === 0) return '';

  const tipEntries = Object.values(tips);
  const totalTips = tipEntries.reduce((sum, tip) => sum + tip.tip_amount, 0);
  const totalRewards = tipEntries.reduce((sum, tip) => sum + tip.voucher_amount, 0);
  
  let tipHistory = `\n\nYour Tipping History:\n`;
  tipHistory += `Total tips given: £${totalTips}\n`;
  tipHistory += `Total rewards earned: £${totalRewards}\n\n`;
  
  tipHistory += tipEntries.map(tip => 
    `- £${tip.tip_amount} tip to ${tip.server_name} on ${new Date(tip.tip_date).toLocaleDateString()}\n` +
    `  Earned £${tip.voucher_amount} reward (${tip.voucher_status})`
  ).join('\n\n');

  return tipHistory;
}
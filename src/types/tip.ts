export interface TipVoucherMetadata {
  tip_amount: number;
  server_name: string;
  tip_date: string;
  voucher_amount: number;
  voucher_code: string;
  voucher_status: string;
  voucher_used_at: string | null;
  expires_at: string;
}

export interface TipMetadata {
  [voucherCode: string]: TipVoucherMetadata;
}
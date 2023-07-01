export interface InputInvoiceSummary {
  id: string;
  no_invoice: string;
  date: string;
  client_name: string;
  service_fee: number;
  rate: number;
  city: string;
  country: string;
  bank_name: string;
  bank_beneficiary: string;
  bank_no: string;
  total_amount: number;
  created_by: string;
  created_date: string;
}

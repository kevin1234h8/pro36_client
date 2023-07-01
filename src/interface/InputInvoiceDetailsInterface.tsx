export interface InputInvoiceDetails {
  no_invoice: string;
  period_from: Date;
  period_to: Date;
  account_no: number;
  broker_name: string;
  profit: number;
  service_cost: number;
  cost_in_rupiah: number;
}

export interface Order {
  id: string;
  phone: string;
  name: string;
  whatsApp: string;
  eventDate: string;
  deadline: string;
  advance1: number;
  advance2: number;
  extraCharge: number;
  discount: number;
  fullTotal: number;
  balance: number;
  status: 'Complete' | 'Pending' | string;
  steps: string;
  customerType: string;
  lastUpdated: string;
}

export type OrderSummary = Pick<Order, 'id' | 'name' | 'fullTotal' | 'balance' | 'status' | 'eventDate'>;

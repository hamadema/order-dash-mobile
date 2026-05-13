import { Order } from '../types';
import { SAMPLE_ORDERS } from '../data/sampleData';
import Papa from 'papaparse';

class OrderService {
  private orders: Order[] = [...SAMPLE_ORDERS];

  private isUsingSampleData = false;

  async getOrders(): Promise<{ orders: Order[], isLive: boolean }> {
    // @ts-ignore
    const apiUrl = import.meta.env.VITE_APPS_SCRIPT_URL;

    if (!apiUrl) {
      this.isUsingSampleData = true;
      console.warn('VITE_APPS_SCRIPT_URL not set, using sample data.');
      return new Promise((resolve) => {
        setTimeout(() => resolve({ orders: this.orders, isLive: false }), 500);
      });
    }

    try {
      // Use no-cache to ensure we get fresh results from the script
      const response = await window.fetch(`${apiUrl}?t=${Date.now()}`);
      if (!response.ok) throw new Error('API fetch failed');
      
      const data = await response.json();
      
      const parsedOrders: Order[] = data.map((row: any) => ({
        id: String(row['Order ID'] || ''),
        phone: String(row['Phone'] || ''),
        name: String(row['Name'] || ''),
        whatsApp: String(row['WhatsApp'] || ''),
        eventDate: String(row['Event Date'] || ''),
        deadline: String(row['Deadline'] || ''),
        advance1: Number(row['Advance 1'] || 0),
        advance2: Number(row['Advance 2'] || 0),
        extraCharge: Number(row['Extra Charge'] || 0),
        discount: Number(row['Discount'] || 0),
        fullTotal: Number(row['Full Total'] || 0),
        balance: Number(row['Balance'] || 0),
        status: String(row['Status'] || 'Pending'),
        steps: String(row['Steps'] || ''),
        customerType: String(row['Customer Type'] || 'STUDIO'),
        lastUpdated: String(row['Last Updated'] || ''),
      }));
      
      this.orders = parsedOrders.filter(o => o.id);
      this.isUsingSampleData = false;
      return { orders: this.orders, isLive: true };
    } catch (error) {
      console.error('Error fetching data from Apps Script:', error);
      this.isUsingSampleData = true;
      return { orders: this.orders, isLive: false }; // Fallback
    }
  }

  async saveOrder(order: Partial<Order>): Promise<boolean> {
    // @ts-ignore
    const apiUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!apiUrl) return false;

    try {
      // Map frontend keys to matching script expectations
      const payload = {
        orderId: order.id,
        phone: order.phone,
        name: order.name,
        whatsapp: order.whatsApp,
        eventDate: order.eventDate,
        deadline: order.deadline,
        adv1: order.advance1,
        adv2: order.advance2,
        extraCharge: order.extraCharge,
        discount: order.discount,
        fullTotal: order.fullTotal,
        balance: order.balance,
        status: order.status,
        steps: order.steps,
        customerType: order.customerType
      };

      const response = await window.fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script POST often requires no-cors if not using a proxy
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // With no-cors, we can't read the response body but we can assume success if it doesn't throw
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }

  async searchOrders(query: string): Promise<Order[]> {
    const q = query.toLowerCase();
    return this.orders.filter(order => 
      order.id.toLowerCase().includes(q) ||
      order.name.toLowerCase().includes(q) ||
      order.phone.includes(q)
    );
  }

  getStats() {
    const total = this.orders.length;
    const completed = this.orders.filter(o => o.status === 'Complete').length;
    const pending = total - completed;
    const totalBalance = this.orders.reduce((acc, o) => acc + o.balance, 0);
    const totalRevenue = this.orders.reduce((acc, o) => acc + o.fullTotal, 0);

    return {
      total,
      completed,
      pending,
      totalBalance,
      totalRevenue
    };
  }
}

export const orderService = new OrderService();

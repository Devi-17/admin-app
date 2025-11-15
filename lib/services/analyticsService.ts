import { getFirebaseAdminDb } from '../firebase-admin';
import { AnalyticsData, OrderStatus } from '../types';

export class AnalyticsService {
  private db = getFirebaseAdminDb();

  /**
   * Get analytics data
   */
  async getAnalytics(startDate?: Date, endDate?: Date): Promise<AnalyticsData> {
    try {
      let query: any = this.db.collection('orders');

      if (startDate) {
        query = query.where('createdAt', '>=', startDate);
      }

      if (endDate) {
        query = query.where('createdAt', '<=', endDate);
      }

      const snapshot = await query.get();
      const orders = snapshot.docs.map((doc: any) => doc.data());

      // Calculate metrics
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Orders by status
      const ordersByStatus: Record<OrderStatus, number> = {
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0,
      };

      orders.forEach((order: any) => {
        const status = order.status || 'pending';
        if (ordersByStatus[status as OrderStatus] !== undefined) {
          ordersByStatus[status as OrderStatus]++;
        }
      });

      // Revenue by period (daily)
      const revenueByPeriod: Array<{ period: string; revenue: number }> = [];
      const periodMap = new Map<string, number>();

      orders.forEach((order: any) => {
        const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
        const period = date.toISOString().split('T')[0];
        periodMap.set(period, (periodMap.get(period) || 0) + (order.total || 0));
      });

      periodMap.forEach((revenue, period) => {
        revenueByPeriod.push({ period, revenue });
      });

      revenueByPeriod.sort((a, b) => a.period.localeCompare(b.period));

      // Top products
      const productMap = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();
      orders.forEach((order: any) => {
        (order.items || []).forEach((item: any) => {
          const existing = productMap.get(item.productId) || {
            productId: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
          existing.quantity += item.quantity || 0;
          existing.revenue += (item.price || 0) * (item.quantity || 0);
          productMap.set(item.productId, existing);
        });
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Orders by date
      const ordersByDate: Array<{ date: string; count: number; revenue: number }> = [];
      const dateMap = new Map<string, { count: number; revenue: number }>();

      orders.forEach((order: any) => {
        const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
        const dateStr = date.toISOString().split('T')[0];
        const existing = dateMap.get(dateStr) || { count: 0, revenue: 0 };
        existing.count++;
        existing.revenue += order.total || 0;
        dateMap.set(dateStr, existing);
      });

      dateMap.forEach((data, date) => {
        ordersByDate.push({ date, ...data });
      });

      ordersByDate.sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        ordersByStatus,
        revenueByPeriod,
        topProducts,
        ordersByDate,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();


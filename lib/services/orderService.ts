import { getFirebaseAdminDb } from '../firebase-admin';
import { Order, OrderStatus } from '../types';

export class OrderService {
  private db = getFirebaseAdminDb();

  /**
   * Get all orders with filters
   */
  async getOrders(filters?: {
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    try {
      let query: any = this.db.collection('orders').orderBy('createdAt', 'desc');

      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters?.startDate) {
        query = query.where('createdAt', '>=', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.where('createdAt', '<=', filters.endDate);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const doc = await this.db.collection('orders').doc(orderId).get();
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    updatedBy: string,
    note?: string
  ): Promise<void> {
    try {
      const orderRef = this.db.collection('orders').doc(orderId);
      const order = await orderRef.get();

      if (!order.exists) {
        throw new Error('Order not found');
      }

      const timeline = order.data()?.timeline || [];
      timeline.push({
        status,
        timestamp: new Date(),
        updatedBy,
        note,
      });

      await orderRef.update({
        status,
        timeline,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Update order
   */
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      await this.db.collection('orders').doc(orderId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Search orders
   */
  async searchOrders(searchTerm: string): Promise<Order[]> {
    try {
      // Simple search - in production, use Algolia or similar
      const snapshot = await this.db.collection('orders')
        .where('orderNumber', '>=', searchTerm)
        .where('orderNumber', '<=', searchTerm + '\uf8ff')
        .limit(50)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();


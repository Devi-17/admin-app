import { getFirebaseAdminDb } from '../firebase-admin';
import { Customer } from '../types';

export class CustomerService {
  private db = getFirebaseAdminDb();

  /**
   * Get all customers
   */
  async getCustomers(filters?: {
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    try {
      let query: any = this.db.collection('users').orderBy('createdAt', 'desc');

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.offset(filters.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({
        uid: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastLoginAt: doc.data().lastLoginAt?.toDate(),
      })) as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      const doc = await this.db.collection('users').doc(customerId).get();
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
        lastLoginAt: data?.lastLoginAt?.toDate(),
      } as Customer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  /**
   * Search customers
   */
  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    try {
      // Simple search - in production, use Algolia or similar
      const snapshot = await this.db.collection('users')
        .where('email', '>=', searchTerm)
        .where('email', '<=', searchTerm + '\uf8ff')
        .limit(50)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate(),
          updatedAt: data?.updatedAt?.toDate(),
          lastLoginAt: data?.lastLoginAt?.toDate(),
        } as Customer;
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Get customer orders
   */
  async getCustomerOrders(customerId: string): Promise<any[]> {
    try {
      const snapshot = await this.db.collection('orders')
        .where('userId', '==', customerId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();


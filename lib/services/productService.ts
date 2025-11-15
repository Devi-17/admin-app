import { getFirebaseAdminDb } from '../firebase-admin';
import { Product, ProductStatus } from '../types';

export class ProductService {
  private db = getFirebaseAdminDb();

  /**
   * Get all products
   */
  async getProducts(filters?: {
    status?: ProductStatus;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    try {
      let query: any = this.db.collection('products').orderBy('createdAt', 'desc');

      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters?.category) {
        query = query.where('category', '==', filters.category);
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
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const doc = await this.db.collection('products').doc(productId).get();
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Create product
   */
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await this.db.collection('products').add({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      await this.db.collection('products').doc(productId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.db.collection('products').doc(productId).delete();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Update inventory
   */
  async updateInventory(productId: string, quantity: number): Promise<void> {
    try {
      await this.db.collection('products').doc(productId).update({
        'inventory.quantity': quantity,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();


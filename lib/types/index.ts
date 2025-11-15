// Core types for admin application

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: AdminRole;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export type AdminRole = 'admin' | 'manager' | 'inventory' | 'orders' | 'viewer';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerId?: string;
  customerInfo: OrderCustomer;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totals: OrderTotals;
  payment: OrderPayment;
  shipping: OrderShipping;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  notes?: string;
  internalNotes?: string;
  tags: string[];
  createdAt: Date | any;
  updatedAt: Date | any;
  source: string;
  channel: string;
}

export interface OrderCustomer {
  id?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isGuest: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  total: number;
  variant?: {
    name: string;
    attributes: VariantAttribute[];
  };
  refundableQuantity: number;
  refundedQuantity: number;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  refunded: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  paidAt?: Date | any;
  failureReason?: string;
}

export type PaymentMethod = 'cod' | 'razorpay' | 'upi' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface OrderShipping {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date | any;
  shippedAt?: Date | any;
  deliveredAt?: Date | any;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: Date | any;
  note?: string;
  updatedBy?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  inventory: ProductInventory;
  images: ProductImage[];
  category: string;
  tags: string[];
  status: ProductStatus;
  isVisible: boolean;
  createdAt: Date | any;
  updatedAt: Date | any;
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Customer {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  profile: CustomerProfile;
  preferences: CustomerPreferences;
  createdAt: Date | any;
  updatedAt: Date | any;
  lastLoginAt?: Date | any;
}

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  addresses: Address[];
  defaultAddressId?: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
}

export interface CustomerPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date | any;
  validUntil: Date | any;
  isActive: boolean;
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface NotificationSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date | any;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByPeriod: Array<{ period: string; revenue: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
  ordersByDate: Array<{ date: string; count: number; revenue: number }>;
}


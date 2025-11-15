/**
 * Input validation utilities
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateOrderStatus(status: string): boolean {
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  return validStatuses.includes(status);
}

export function validateProductStatus(status: string): boolean {
  const validStatuses = ['active', 'inactive', 'draft', 'archived'];
  return validStatuses.includes(status);
}

export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && isFinite(price);
}

export function validateQuantity(quantity: number): boolean {
  return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity);
}

export function validateId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as any;
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized as T;
}


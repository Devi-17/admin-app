import { getFirebaseAdminDb } from '../firebase-admin';

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
  try {
    const db = getFirebaseAdminDb();
    await db.collection('auditLogs').add({
      ...entry,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}


import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminAuth } from '../firebase-admin';
import { createAuditLog, getClientIP, getUserAgent } from '../utils/auditLog';

/**
 * Verify Firebase ID token from request
 */
export async function verifyAuthToken(request: NextRequest): Promise<{ uid: string; email?: string } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Validate token format
    if (!idToken || idToken.length < 10) {
      return null;
    }

    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    // Log failed auth attempt
    await createAuditLog({
      userId: 'anonymous',
      action: 'AUTH_FAILED',
      resource: 'api',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });
    return null;
  }
}

/**
 * Middleware to protect API routes
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | { uid: string; email?: string }> {
  const user = await verifyAuthToken(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | { uid: string; email?: string }> {
  const user = await requireAuth(request);
  
  if (user instanceof NextResponse) {
    return user;
  }

  // Check admin role (this would need to fetch from Firestore)
  // For now, we'll check in the API route itself
  return user;
}


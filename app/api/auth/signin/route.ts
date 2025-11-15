import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminAuth, getFirebaseAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const auth = getFirebaseAdminAuth();
    
    // Verify user exists and get UID
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is an admin user
    const db = getFirebaseAdminDb();
    const adminUserDoc = await db.collection('adminUsers').doc(user.uid).get();

    if (!adminUserDoc.exists) {
      return NextResponse.json(
        { error: 'Access denied. Admin account not found.' },
        { status: 403 }
      );
    }

    const adminUserData = adminUserDoc.data();
    if (adminUserData?.isActive === false) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Update last login
    await db.collection('adminUsers').doc(user.uid).update({
      lastLoginAt: new Date(),
    });

    // Create custom token for client-side authentication
    const customToken = await auth.createCustomToken(user.uid, {
      admin: true,
      role: adminUserData?.role || 'viewer',
    });

    return NextResponse.json({
      success: true,
      customToken,
      uid: user.uid,
    });
  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { AdminUser } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const db = getFirebaseAdminDb();
    const userDoc = await db.collection('adminUsers').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    const data = userDoc.data();
    const adminUser: AdminUser = {
      uid: uid,
      email: data?.email || '',
      displayName: data?.displayName,
      photoURL: data?.photoURL,
      role: data?.role || 'viewer',
      permissions: data?.permissions || [],
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
      lastLoginAt: data?.lastLoginAt?.toDate(),
      isActive: data?.isActive !== false,
    };

    return NextResponse.json({ adminUser });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


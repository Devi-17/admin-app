import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { endpoint, token } = body;

    if (!endpoint && !token) {
      return NextResponse.json(
        { error: 'Endpoint or token required' },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    let query: any = db.collection('notificationSubscriptions')
      .where('userId', '==', authResult.uid);

    if (endpoint) {
      query = query.where('endpoint', '==', endpoint);
    } else if (token) {
      query = query.where('token', '==', token);
    }

    const snapshot = await query.get();
    const batch = db.batch();

    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error unsubscribing from notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


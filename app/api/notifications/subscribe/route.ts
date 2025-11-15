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
    const { token, type, endpoint, keys } = body;

    if (!token && !endpoint) {
      return NextResponse.json(
        { error: 'Token or endpoint required' },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    const subscriptionData: any = {
      userId: authResult.uid,
      type: type || (token ? 'fcm' : 'webpush'),
      createdAt: new Date(),
    };

    if (token) {
      subscriptionData.token = token;
    }

    if (endpoint) {
      subscriptionData.endpoint = endpoint;
      subscriptionData.keys = keys;
    }

    const docRef = await db.collection('notificationSubscriptions').add(subscriptionData);

    return NextResponse.json({
      success: true,
      subscription: {
        id: docRef.id,
        ...subscriptionData,
      },
    });
  } catch (error: any) {
    console.error('Error subscribing to notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


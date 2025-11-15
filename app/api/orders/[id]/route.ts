import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { orderService } from '@/lib/services/orderService';
import { validateOrderStatus, validateId } from '@/lib/utils/validation';
import { createAuditLog, getClientIP, getUserAgent } from '@/lib/utils/auditLog';
import { rateLimit } from '@/lib/utils/rateLimit';

// Make this route dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const clientIP = getClientIP(request);
  const limit = rateLimit(clientIP || 'unknown', { windowMs: 60000, maxRequests: 200 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Validate ID
    if (!validateId(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await orderService.getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Log access
    await createAuditLog({
      userId: authResult.uid,
      action: 'VIEW_ORDER',
      resource: 'order',
      resourceId: id,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const clientIP = getClientIP(request);
  const limit = rateLimit(clientIP || 'unknown', { windowMs: 60000, maxRequests: 50 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Validate ID
    if (!validateId(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, ...updates } = body;

    // Validate status if provided
    if (status && !validateOrderStatus(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    if (status) {
      await orderService.updateOrderStatus(
        id,
        status,
        authResult.uid,
        updates.note
      );
    } else {
      await orderService.updateOrder(id, updates);
    }

    // Log update
    await createAuditLog({
      userId: authResult.uid,
      action: 'UPDATE_ORDER',
      resource: 'order',
      resourceId: id,
      details: { status, updates },
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const order = await orderService.getOrderById(id);
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


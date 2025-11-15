import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '../utils/rateLimit';
import { getClientIP } from '../utils/auditLog';

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: { windowMs?: number; maxRequests?: number }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const identifier = getClientIP(req) || 'unknown';
    const limit = rateLimit(identifier, {
      windowMs: options?.windowMs || 60000, // 1 minute
      maxRequests: options?.maxRequests || 100,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': (options?.maxRequests || 100).toString(),
            'X-RateLimit-Remaining': limit.remaining.toString(),
            'X-RateLimit-Reset': limit.resetTime.toString(),
          },
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', (options?.maxRequests || 100).toString());
    response.headers.set('X-RateLimit-Remaining', limit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', limit.resetTime.toString());

    return response;
  };
}


import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const apiKey = req.headers.get('authorization');

  if (apiKey !== `Bearer ${process.env.API_KEY}`) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/promotions/store',
};
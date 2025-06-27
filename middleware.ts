import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.API_KEY) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/promotions/store',
};

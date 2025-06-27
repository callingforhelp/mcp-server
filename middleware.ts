import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.INTERNAL_API_KEY));
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'authentication failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: '/api/promotions/store',
};
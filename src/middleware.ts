import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Allow access to main dashboard page
    if (pathname === '/dashboard') {
      return NextResponse.next();
    }
    
    // For other dashboard routes, we'll check jalur selection on client side
    // since we can't access session data in middleware
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
// middleware.ts (atau proxy.ts sesuai warning)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ambil session dari cookie
  const session = request.cookies.get('admin_session')
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  
  // Jangan blokir API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Jika akses halaman admin (kecuali login) dan belum login
  if (isAdminPath && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Jika sudah login tapi akses halaman login
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Konfigurasi path mana yang akan menggunakan middleware
export const config = {
  matcher: '/admin/:path*'  // Hanya untuk path yang dimulai dengan /admin
}
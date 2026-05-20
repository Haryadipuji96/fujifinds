import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Waktu timeout: 30 menit tidak aktif akan logout otomatis
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 menit dalam milidetik

export function middleware(request: NextRequest) {
  // Hanya untuk halaman admin (kecuali halaman login)
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Skip halaman login
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Ambil session dari cookie
  const sessionCookie = request.cookies.get('admin_session')
  
  if (!sessionCookie) {
    // Tidak ada session, redirect ke login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_session')
    return response
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const now = Date.now()
    const lastActivity = session.lastActivity || session.loginAt
    const timeSinceLastActivity = now - lastActivity

    // Jika sudah tidak aktif melebihi timeout
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }

    // Update lastActivity di cookie untuk request ini
    const updatedSession = {
      ...session,
      lastActivity: now
    }
    
    const response = NextResponse.next()
    response.cookies.set('admin_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })
    
    return response
  } catch (error) {
    // Session corrupt, hapus dan redirect ke login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin_session')
    return response
  }
}

export const config = {
  matcher: '/admin/:path*'
}
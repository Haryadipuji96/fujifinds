import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 menit

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')
  
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const now = Date.now()
    const lastActivity = session.lastActivity || session.loginAt
    const timeSinceLastActivity = now - lastActivity

    // Cek apakah session expired karena tidak aktif
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      cookieStore.delete('admin_session')
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.json({
      id: session.id,
      email: session.email,
      name: session.name
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
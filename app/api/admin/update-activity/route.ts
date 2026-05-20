import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const now = Date.now()
    const nowISO = new Date().toISOString()

    // Update last_activity di database
    const supabase = await createClient()
    await supabase
      .from('admins')
      .update({ last_activity: nowISO })
      .eq('id', session.id)

    // Update cookie dengan lastActivity baru
    const updatedSession = {
      ...session,
      lastActivity: now
    }

    cookieStore.set('admin_session', JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update activity error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
// app/api/auth/me/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminData = JSON.parse(session.value)
    return NextResponse.json(adminData)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
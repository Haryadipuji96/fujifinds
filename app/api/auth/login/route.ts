// app/api/auth/login/route.ts
import { createClient } from '@/lib/supabase/server' // Ganti nama import
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Cari admin di database
    const supabase = await createClient() // Gunakan createClient
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Update last_login
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', JSON.stringify({
      id: admin.id,
      email: admin.email,
      name: admin.name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 jam
      path: '/'
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
// app/api/click/route.ts
import { createClient } from '@/lib/supabase/server' // Ganti import
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { product_id, product_name, platform } = await request.json()
    
    const supabase = await createClient() // Gunakan createClient
    
    const { error } = await supabase.from('click_logs').insert({
      product_id,
      product_name,
      platform,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track click error:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
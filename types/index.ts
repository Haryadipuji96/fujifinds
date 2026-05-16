// types/index.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  rating: number;
  images: string[];
  affiliate_link: string;
  platform: 'Shopee' | 'TikTok';
  category_id?: string;
  category?: Category;
  is_active: boolean;
  is_trending: boolean;
  stock: number;
  specs?: any;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ClickLog {
  id: string;
  product_id: string;
  product_name: string;
  platform: string;
  ip_address: string;
  user_agent: string;
  clicked_at: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
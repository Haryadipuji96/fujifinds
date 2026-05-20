'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Home, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      // Migrasi wishlist dari guest ke user
      await migrateWishlistToUser()
      toast.success('Login berhasil!')
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  const migrateWishlistToUser = async () => {
    const guestId = localStorage.getItem('user_id')
    if (!guestId) return

    const { data: wishlist } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', guestId)

    if (wishlist && wishlist.length > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        for (const item of wishlist) {
          await supabase
            .from('wishlist')
            .upsert({
              user_id: user.id,
              product_id: item.product_id,
            }, {
              onConflict: 'user_id,product_id',
            })
        }
        await supabase.from('wishlist').delete().eq('user_id', guestId)
        localStorage.removeItem('user_id')
        toast.success(`${wishlist.length} produk dari wishlist telah dipindahkan ke akun Anda!`)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
          <CardDescription>Masukkan email dan password kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button 
  type="submit" 
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-slate-900 dark:text-white font-semibold"
  disabled={loading}
>
  {loading ? 'Memproses...' : 'Login'}
</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">Atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <Home className="h-4 w-4" />
            {googleLoading ? 'Memproses...' : 'Login dengan Google'}
          </Button>

          <div className="mt-6 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-purple-600 hover:text-purple-500">
              Daftar Sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
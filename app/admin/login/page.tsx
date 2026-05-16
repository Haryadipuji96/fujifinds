// app/admin/login/page.tsx
'use client'

import { useState, type FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, LogIn, Sparkles, Shield, Lock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      toast.success('Login berhasil!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background animate-gradient" />
      
      {/* Animated Blobs */}
      <div 
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"
        style={{ 
          top: `${mousePosition.y * 0.05}px`, 
          left: `${mousePosition.x * 0.05}px`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div 
        className="absolute w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float-delayed"
        style={{ 
          bottom: `${mousePosition.y * 0.03}px`, 
          right: `${mousePosition.x * 0.03}px`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <Card className="w-full max-w-md mx-4 relative z-10 backdrop-blur-sm bg-background/80 border-primary/20 shadow-2xl animate-fade-in-up">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
        
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg animate-float">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan kredensial Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="relative bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Password
              </Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="relative bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300 pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-300"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Login
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Secure Admin Access</span>
              <Sparkles className="h-3 w-3" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo: admin@example.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
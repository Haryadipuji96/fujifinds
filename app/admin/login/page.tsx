'use client'

import { useState, type FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, LogIn, Sparkles, Shield, Lock, Mail, ArrowRight, Star, Key, Fingerprint } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00D4FF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF006E]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Animated Orbs */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-[#00D4FF]/10 to-[#FF006E]/10 rounded-full blur-3xl animate-float"
        style={{ 
          top: `${mousePosition.y * 0.05}px`, 
          left: `${mousePosition.x * 0.05}px`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div 
        className="absolute w-80 h-80 bg-gradient-to-r from-[#FF006E]/10 to-purple-500/10 rounded-full blur-3xl animate-float-delayed"
        style={{ 
          bottom: `${mousePosition.y * 0.03}px`, 
          right: `${mousePosition.x * 0.03}px`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      <Card className="w-full max-w-md mx-4 relative z-10 backdrop-blur-xl bg-slate-900/80 border-slate-700 shadow-2xl shadow-[#00D4FF]/10 animate-fade-in-up">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00D4FF]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FF006E]/10 rounded-full blur-2xl" />
        
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#FF006E] rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/50 animate-float">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#FF006E] to-[#00D4FF] bg-clip-text text-transparent animate-gradient">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#00D4FF]" />
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D4FF] to-[#FF006E] rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="relative bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 transition-all duration-300 pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#00D4FF] transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-[#FF006E]" />
                Password
              </Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D4FF] to-[#FF006E] rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="relative bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 transition-all duration-300 pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#FF006E] transition-colors" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group bg-gradient-to-r from-[#00D4FF] to-[#FF006E] hover:from-[#00D4FF]/90 hover:to-[#FF006E]/90 shadow-lg shadow-[#00D4FF]/25 transition-all duration-300 rounded-xl py-6"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-3 text-white font-semibold">
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-4 w-4" />
                    Sign In
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-slate-500">
                <Shield className="h-3 w-3 text-[#00D4FF]" />
                <span>Secure Admin Access</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="flex items-center gap-1 text-slate-500">
                <Sparkles className="h-3 w-3 text-[#FF006E]" />
                <span>Encrypted Connection</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-xs text-slate-400">
                <span className="text-[#00D4FF]">Demo Credentials:</span> admin@example.com / admin123
              </p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-500">
              <Star className="h-3 w-3 fill-[#00D4FF] text-[#00D4FF]" />
              <span>Powered by AffiliatePro</span>
              <Star className="h-3 w-3 fill-[#FF006E] text-[#FF006E]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
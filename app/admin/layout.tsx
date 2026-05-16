// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Cek autentikasi saat load
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Hapus data lokal
        localStorage.removeItem('admin_session')
        sessionStorage.clear()
        
        toast.success('Logout berhasil')
        router.push('/admin/login')
        router.refresh() // Refresh untuk memastikan session benar-benar hilang
      } else {
        toast.error('Gagal logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
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
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
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
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
  // Tambahkan class ke body untuk styling admin
  document.body.classList.add('admin-layout')
  return () => {
    document.body.classList.remove('admin-layout')
  }
}, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        localStorage.removeItem('admin_session')
        sessionStorage.clear()
        toast.success('Logout berhasil')
        router.push('/admin/login')
        router.refresh()
      } else {
        toast.error('Gagal logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/25"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </button>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`p-4 border-b border-slate-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#FF006E]">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-[#00D4FF] to-[#FF006E] bg-clip-text text-transparent">AffiliatePro</span>
                  <span className="block text-[10px] text-slate-500">Admin Panel</span>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#FF006E]">
                <Zap className="h-5 w-5 text-white" />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-1 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00D4FF]/20 to-[#FF006E]/20 text-white border border-[#00D4FF]/30 shadow-lg shadow-[#00D4FF]/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''} ${isActive ? 'text-[#00D4FF]' : 'group-hover:text-[#00D4FF] transition-colors'}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && !collapsed && (
                    <Sparkles className="h-3 w-3 text-[#FF006E] ml-auto" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className={`p-4 border-t border-slate-700 ${collapsed ? 'flex justify-center' : ''}`}>
            <Button
              variant="ghost"
              className={`${collapsed ? 'w-auto px-3' : 'w-full justify-start gap-3'} text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl`}
              onClick={handleLogout}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
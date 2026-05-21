'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Sun, Moon, User, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/useSupabase'
import { useTheme } from '@/components/theme-provider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useSupabase()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Shopee', href: '/platform/shopee' },
    { name: 'TikTok', href: '/platform/tiktok' },
    { name: 'Trending', href: '/trending' },
    { name: 'Semua Produk', href: '/product' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Tentang Kami', href: '/about' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg' 
          : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base md:text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Affiliate Store
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 -mt-1">Premium Affiliate</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                      isActive 
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/50 shadow-sm' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/30'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-950/50"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-slate-700" />
                  )}
                </Button>
              )}

              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-950/50"
                >
                  <Heart className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </Button>
              </Link>

              {/* User / Login */}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:block">
                    Hi, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-100 dark:hover:bg-red-950/50"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    size="sm"
                    className="rounded-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Masuk
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-slate-700 dark:text-slate-300" /> 
                ) : (
                  <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-slate-950 backdrop-blur-xl transition-all duration-500 md:hidden ${
        isOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-20 pb-8">
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-xl font-medium transition-all duration-300 hover:scale-110 ${
                  pathname === item.href 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
              >
                Masuk
              </Link>
            )}
          </div>
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            <p>© 2024 Affiliate Store</p>
          </div>
        </div>
      </div>
    </>
  )
}
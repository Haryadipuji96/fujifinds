// components/layout/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Sun, Moon, ChevronRight, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Shopee', href: '/platform/shopee' },
    { name: 'TikTok', href: '/platform/tiktok' },
    { name: 'Semua Produk', href: '/products' },
  ]

  // Don't render theme toggle until mounted on client
  const renderThemeToggle = () => {
    if (!mounted) {
      return (
        <Button variant="ghost" size="icon" className="relative overflow-hidden group">
          <div className="h-5 w-5" />
        </Button>
      )
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative overflow-hidden group transition-all duration-300 hover:scale-110"
      >
        <div className="relative z-10 transition-transform duration-500 group-hover:rotate-12">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </div>
        <span className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
      </Button>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative group">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <ShoppingBag className="h-7 w-7 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Affiliate Store
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 border border-border focus:border-primary focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg overflow-hidden group ${
                    pathname === item.href 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute inset-0 bg-primary/10 rounded-lg transition-all duration-300 transform ${
                    pathname === item.href ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden relative overflow-hidden group transition-all duration-300 hover:scale-110"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              {renderThemeToggle()}

              {/* User Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative overflow-hidden group transition-all duration-300 hover:scale-110"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative overflow-hidden group"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="relative z-10 transition-transform duration-300">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Mobile Search Bar */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b transition-all duration-300 md:hidden ${
        searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none transition-all"
              autoFocus={searchOpen}
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
        isOpen 
          ? 'opacity-100 visible translate-x-0' 
          : 'opacity-0 invisible translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-20 pb-8">
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group relative text-2xl font-medium transition-all duration-300 transform hover:scale-110 ${
                  pathname === item.href 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                <ChevronRight className="absolute -right-8 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-[-10px]" />
              </Link>
            ))}
          </div>
          
          {/* Mobile Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Affiliate Store</p>
          </div>
        </div>
      </div>
    </>
  )
}
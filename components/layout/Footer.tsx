// components/layout/Footer.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ShoppingBag,
  Mail,
  MapPin,
  Phone,
  Send,
  Heart,
  ArrowUp,
  Globe,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Social links dengan icon yang tersedia di lucide-react
  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', href: '#', color: 'hover:bg-[#1877f2]' },
    { name: 'Twitter', icon: 'twitter', href: '#', color: 'hover:bg-[#1da1f2]' },
    { name: 'Instagram', icon: 'instagram', href: '#', color: 'hover:bg-[#e4405f]' },
    { name: 'YouTube', icon: 'youtube', href: '#', color: 'hover:bg-[#ff0000]' },
  ]

  // Fungsi untuk mendapatkan icon component berdasarkan nama
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        )
      case 'twitter':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
        )
      case 'instagram':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        )
      case 'youtube':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        )
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Shopee', href: '/platform/shopee' },
    { name: 'TikTok', href: '/platform/tiktok' },
    { name: 'Semua Produk', href: '/products' },
    { name: 'Tentang Kami', href: '/about' },
  ]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Masukkan email Anda')
      return
    }
    setIsSubscribing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Berhasil berlangganan newsletter!')
    setEmail('')
    setIsSubscribing(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t mt-20">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Animated blob background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in-up">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Affiliate Store
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Temukan produk terbaik dengan harga terbaik dari Shopee dan TikTok Shop. 
              Dapatkan penawaran eksklusif hanya di sini!
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-2 rounded-full bg-muted/50 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 group`}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {getSocialIcon(social.icon)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold text-lg relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 animate-fade-in-up animation-delay-400">
            <h3 className="font-semibold text-lg relative inline-block">
              Kontak Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Jakarta, Indonesia</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="mailto:info@affiliatestore.com" 
                  className="hover:text-primary transition-colors"
                >
                  info@affiliatestore.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 animate-fade-in-up animation-delay-600">
            <h3 className="font-semibold text-lg relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </h3>
            <p className="text-sm text-muted-foreground">
              Dapatkan promo terbaru langsung ke email Anda!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none transition-all duration-300"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubscribing}
                className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center group"
              >
                {isSubscribing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500 animate-pulse" />
              Kami tidak akan spam. Kami hormati privasi Anda.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Affiliate Store. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-2">
            <Link href="/privacy" className="hover:text-primary transition-colors text-xs hover:translate-y-[-2px] inline-block transition-transform">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors text-xs hover:translate-y-[-2px] inline-block transition-transform">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  )
}
'use client'

import Link from 'next/link'
import {
  Heart,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
  Globe,
  Share2,
  Camera,
  Play,
  Send
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Globe, href: 'https://www.tiktok.com/@fujiharyadi735', name: 'Facebook', bg: 'hover:bg-[#1877f2]' },
    { icon: Share2, href: 'https://web.telegram.org/k/', name: 'Twitter', bg: 'hover:bg-[#1da1f2]' },
    { icon: Camera, href: 'https://www.instagram.com/puji_haryadi86/', name: 'Instagram', bg: 'hover:bg-[#e4405f]' },
    { icon: Play, href: 'https://www.youtube.com/@fujiharyadi1411', name: 'YouTube', bg: 'hover:bg-[#ff0000]' },
  ]

  const quickLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Shopee', href: '/platform/shopee' },
    { name: 'TikTok', href: '/platform/tiktok' },
    { name: 'Semua Produk', href: '/product' },
     { name: 'Wishlist', href: '/wishlist' },
    { name: 'Tentang Kami', href: '/about' },
  ]

  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 w-full">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      
      {/* Main Footer Container - CENTERED */}
      <div className="w-full bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          
          {/* Grid Layout - 4 columns with proper spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group w-fit">
                <div className="p-1.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Fujifinds Store
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Premium Affiliate Partner</p>
                </div>
              </Link>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Temukan produk terbaik dari Shopee dan TikTok Shop dengan harga terbaik dan promo eksklusif hanya di Fujifinds Store.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-2 pt-2">
                {socialLinks.map(({ icon: Icon, bg, name }, i) => (
                  <a
                    key={i}
                    href={socialLinks[i].href}
                    aria-label={name}
                    className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 ${bg} hover:text-white hover:-translate-y-1 transition-all duration-300`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-sm">Quick Links</span>
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-all">›</span>
                      <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-sm">Contact Us</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <span>Tasikmalaya, Indonesia</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Mail className="h-4 w-4 text-purple-500 shrink-0" />
                  <a href="mailto:support@fujifindsstore.com" className="hover:text-purple-500 transition-colors break-all">
                    fujiharyadi0@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Phone className="h-4 w-4 text-purple-500 shrink-0" />
                  <a href="tel:+6281234567890" className="hover:text-purple-500 transition-colors">
                    +62 85794586552
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-sm">Newsletter</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Dapatkan promo eksklusif dan update produk terbaru!
              </p>
              
              {/* Newsletter Form - FIXED alignment */}
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button className="w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Send className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar - CENTERED with proper spacing */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <p>© {currentYear} Fujifinds Store. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-purple-500 transition-colors">Privacy Policy</Link>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <Link href="/terms" className="hover:text-purple-500 transition-colors">Terms of Service</Link>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <Link href="/faq" className="hover:text-purple-500 transition-colors">FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
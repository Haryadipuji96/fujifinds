'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Sparkles, Zap, Users, Award, Heart, ShoppingBag, Music2, TrendingUp, Star, Globe, Clock, ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()

  const stats = [
    { value: '10K+', label: 'Produk Tersedia', icon: ShoppingBag },
    { value: '99%', label: 'Kepuasan Pelanggan', icon: Star },
    { value: '50K+', label: 'Customer Happy', icon: Users },
    { value: '24/7', label: 'Support Aktif', icon: Clock },
  ]

  const values = [
    {
      icon: Shield,
      title: 'Terpercaya',
      description: 'Kami hanya menyediakan link affiliate resmi dari Shopee dan TikTok Shop yang terjamin keamanannya.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Update',
      description: 'Produk selalu diperbarui setiap hari dengan penawaran dan promo terbaru.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Prioritas utama kami adalah memberikan pengalaman belanja terbaik untuk Anda.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Kurasi ketat untuk memastikan hanya produk berkualitas yang kami rekomendasikan.',
      color: 'from-purple-500 to-indigo-500'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Tombol Kembali - LEFT ALIGNED */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-4 md:mb-6 gap-2 -ml-2 text-sm rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          {/* Title & Description - LEFT ALIGNED (bukan tengah) */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Tentang Affiliate Store
            </h1>
            <p className="text-white/80 text-sm md:text-base lg:text-lg">
              Platform affiliate shopping terpercaya yang menghubungkan Anda dengan produk terbaik dari Shopee dan TikTok Shop
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full">
            <path 
              fill="currentColor" 
              fillOpacity="0.1" 
              d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" 
              className="text-white dark:text-slate-950"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 md:p-6 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">
              Our Story
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full" />
          </div>
          
          <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="text-sm md:text-base">
              Affiliate Store lahir dari semangat untuk memudahkan masyarakat Indonesia dalam menemukan produk-produk terbaik dari platform e-commerce terbesar seperti Shopee dan TikTok Shop.
            </p>
            <p className="text-sm md:text-base">
              Kami memahami bahwa mencari produk berkualitas dengan harga terbaik di tengah ribuan pilihan bisa menjadi tantangan. Oleh karena itu, kami hadir sebagai solusi dengan mengkurasi produk-produk unggulan dari berbagai kategori.
            </p>
            <p className="text-sm md:text-base">
              Setiap produk yang kami rekomendasikan telah melalui proses seleksi ketat untuk memastikan kualitas, harga terbaik, dan keaslian dari merchant terpercaya. Kami berkomitmen untuk terus memberikan pengalaman berbelanja yang aman, nyaman, dan menguntungkan bagi setiap pelanggan.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full" />
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm md:text-base">
              Prinsip yang menjadi landasan kami dalam melayani Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl p-5 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">
            Partner Platforms
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3 rounded-full" />
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm md:text-base">
            Bekerja sama dengan platform e-commerce terbesar di Indonesia
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-orange-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Shopee</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Official Affiliate Partner</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Music2 className="h-10 w-10 md:h-12 md:w-12 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">TikTok Shop</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Official Affiliate Partner</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Siap Berbelanja?
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Temukan ribuan produk terbaik dari Shopee dan TikTok Shop dengan harga terbaik
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-purple-600 rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-sm md:text-base"
            >
              🛒 Mulai Belanja
            </Link>
            <Link 
              href="/products"
              className="px-6 md:px-8 py-2.5 md:py-3 border border-white/50 rounded-lg font-medium text-white hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sparkles, ArrowRight, ChevronRight, Shield, Truck, Clock, Heart, ShoppingBag, Music2, TrendingUp, Star, Zap, Crown, Flame, Gem, Laptop, Shirt, Bike, Coffee, HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  // Icon mapping untuk kategori
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, any> = {
      'Elektronik': Laptop,
      'Fashion': Shirt,
      'Olahraga': Bike,
      'Makanan-minuman': Coffee,
      'Kesehatan': HeartPulse,
    }
    const Icon = icons[categoryName] || ShoppingBag
    return <Icon className="h-3 w-3 md:h-4 md:w-4" />
  }

  useEffect(() => {
    fetchProducts()
    fetchTrendingProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(24)

      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .eq('is_trending', true)
        .limit(12)

      setTrendingProducts(data || [])
    } catch (error) {
      console.error('Error fetching trending:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleBuyClick = async (productId: string) => {
    const product = products.find(p => p.id === productId) || trendingProducts.find(p => p.id === productId)
    if (!product) return

    try {
      await fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          product_name: product.name,
          platform: product.platform
        })
      })
      window.open(product.affiliate_link, '_blank')
      toast.success('Redirecting to store...')
    } catch (error) {
      window.open(product.affiliate_link, '_blank')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const features = [
    { icon: Zap, title: 'Update Real-Time', desc: 'Produk terbaru setiap hari, gak ketinggalan zaman', color: 'text-yellow-500', bg: 'from-yellow-500 to-orange-500' },
    { icon: Crown, title: 'Kurasi Premium', desc: 'Cuma produk kece yang layak masuk sini', color: 'text-purple-500', bg: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: '100% Aman', desc: 'Link affiliate resmi, gak pake tipu-tipu', color: 'text-green-500', bg: 'from-green-500 to-emerald-500' },
    { icon: Truck, title: 'Gratis Ongkir', desc: 'Banyak promo ongkir khusus buat kamu', color: 'text-blue-500', bg: 'from-blue-500 to-cyan-500' },
  ]

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Cyberpunk Style */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 hero-cyberpunk">
        <div className="absolute inset-0 cyber-grid" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-fuchsia-500/15 dark:bg-fuchsia-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl animate-float animation-delay-200" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm mb-4 md:mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-600 dark:text-cyan-400 text-[10px] md:text-xs font-mono tracking-wider">#BELANJAGAMPANG</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-3 md:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                CURATED DEALS
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 dark:from-fuchsia-500 dark:to-purple-600">
                BUAT KAMU
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 font-mono text-xs md:text-sm lg:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
              &lt;Rekomendasi produk terbaik dari Shopee &amp; TikTok Shop khusus buat kamu yang gak mau ribet cari barang kece /&gt;<br />
              Update setiap hari. Harga terbaik. Dijamin ori.
            </p>
            
            <div className="max-w-xl mx-auto mb-6 md:mb-8">
              <div className="relative flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-cyan-500/30 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <Search className="absolute left-4 h-4 w-4 md:h-5 md:w-5 text-cyan-500" />
                <Input
                  type="text"
                  placeholder="Cari barang inceranmu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group relative px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">⚡ BELANJA SEKARANG ⚡</span>
              </button>
              <Link 
                href="/product"
                className="px-6 md:px-8 py-2.5 md:py-3 border border-cyan-500/50 rounded-lg font-mono text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
              >
                &gt; JELAJAHI_SEMUA
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-12 mt-8 md:mt-12">
              {[
                { value: '10K+', label: 'Produk Kece', color: 'text-cyan-600 dark:text-cyan-400' },
                { value: '99%', label: 'Puas & Balik Lagi', color: 'text-fuchsia-600 dark:text-fuchsia-400' },
                { value: '24/7', label: 'Siap Bantuin Kamu', color: 'text-blue-600 dark:text-blue-400' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-xl md:text-2xl lg:text-3xl font-black ${stat.color} font-mono`}>{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
        <div className="absolute top-1/4 left-0 w-px h-20 md:h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse" style={{ left: '10%' }} />
        <div className="absolute bottom-1/4 right-0 w-px h-20 md:h-32 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent animate-pulse animation-delay-200" style={{ right: '10%' }} />
      </section>

      {/* Category Pills */}
      <section className="py-6 md:py-8 container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 text-slate-700 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            <Gem className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm font-medium">Semua</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 text-slate-700 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              {getCategoryIcon(category.name)}
              <span className="text-xs md:text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600 dark:from-cyan-400 dark:to-fuchsia-500">
            Kenapa Harus Belanja di Sini?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs md:text-sm mt-1 md:mt-2">Kami urusin ribetnya, kamu tinggal klik dan checkout</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl p-3 md:p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${feature.bg} flex items-center justify-center mb-2 md:mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <h3 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1 text-slate-800 dark:text-white">{feature.title}</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-8 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                  <Flame className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                    LAGI HITZ 🔥
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono">Produk paling rame diburu minggu ini</p>
                </div>
              </div>
              <Link href="/trending" className="text-cyan-600 dark:text-cyan-400 text-xs md:text-sm hover:text-cyan-500 flex items-center gap-1 group font-mono">
                LIHAT SEMUA
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse aspect-square" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {trendingProducts.slice(0, 6).map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} onBuyClick={handleBuyClick} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500">
            BARU NONGOL ✨
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">Produk fresh setiap hari, langsung dari affiliate terupdate</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse aspect-square" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-4xl md:text-5xl mb-4 animate-pulse">🔍</div>
            <h3 className="text-lg md:text-xl font-bold text-slate-700 dark:text-white mb-2 font-mono">PRODUK GAK DITEMUKAN</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Coba pake kata kunci lain atau pilih kategori yang berbeda</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-3 md:px-4 py-1.5 md:py-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-mono"
            >
              &gt; RESET_FILTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                <ProductCard product={product} onBuyClick={handleBuyClick} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-purple-500/10" />
        <div className="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ top: '-30%', left: '-10%' }} />
        <div className="absolute w-[250px] md:w-[300px] h-[250px] md:h-[300px] bg-fuchsia-500/20 rounded-full blur-3xl animate-float animation-delay-200" style={{ bottom: '-20%', right: '-5%' }} />
        
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 mb-4 md:mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs md:text-sm font-mono text-cyan-600 dark:text-cyan-400">PROMO TERBATAS</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 md:mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                SIAP BORONG
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 dark:from-fuchsia-500 dark:to-purple-600">
                PRODUK KECE?
              </span>
            </h2>
            
            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-6 md:mb-8 font-mono">
              Dapetin diskon sampai 70% + Gratis Ongkir buat pembelian pertama kamu!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group relative px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">⚡ GAS BELANJA ⚡</span>
              </button>
              <Link 
                href="/product"
                className="px-6 md:px-8 py-2.5 md:py-3 border border-cyan-500/50 rounded-lg font-mono text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm text-sm md:text-base"
              >
                &gt; LIHAT_SEMUA_PRODUK
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] md:text-xs">10K+ PELANGGAN PUAS</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-600 dark:text-slate-300">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-cyan-500" />
                <span className="font-mono text-[10px] md:text-xs">BAYAR AMAN</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-600 dark:text-slate-300">
                <Truck className="h-3 w-3 md:h-4 md:w-4 text-fuchsia-500" />
                <span className="font-mono text-[10px] md:text-xs">GRATIS ONGKIR</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent animate-pulse animation-delay-200" />
      </section>
    </div>
  )
}
// app/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, Sparkles, ArrowRight, Star, ChevronRight, Zap, Award, Shield, Truck, Clock, Heart, Eye, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
    fetchTrendingProducts()

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12)

      const { data, error } = await query
      if (error) throw error
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
        .limit(8)

      setTrendingProducts(data || [])
    } catch (error) {
      console.error('Error fetching trending:', error)
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
      console.error('Error tracking click:', error)
      window.open(product.affiliate_link, '_blank')
    }
  }

  const handleFilter = (platform: string) => {
    setSelectedPlatform(platform)
    setActiveFilter(platform)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || product.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const features = [
    { icon: Zap, title: 'Update Real-time', desc: 'Produk terbaru setiap hari', color: 'from-yellow-500 to-orange-500' },
    { icon: Award, title: 'Produk Terkurasi', desc: 'Hanya produk berkualitas', color: 'from-purple-500 to-pink-500' },
    { icon: Shield, title: 'Aman & Terpercaya', desc: 'Link affiliate resmi', color: 'from-green-500 to-emerald-500' },
    { icon: Truck, title: 'Gratis Ongkir', desc: 'Promo spesial setiap hari', color: 'from-blue-500 to-cyan-500' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Parallax Effect */}
      <section 
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated Gradient Orbs */}
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl animate-float"
          style={{ 
            top: `${mousePosition.y * 0.02}px`, 
            left: `${mousePosition.x * 0.02}px`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-float-delayed"
          style={{ 
            bottom: `${mousePosition.y * 0.015}px`, 
            right: `${mousePosition.x * 0.015}px`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in-up border border-primary/20 group hover:scale-105 transition-transform duration-300">
              <Star className="h-4 w-4 text-primary fill-primary animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                #1 Affiliate Platform di Indonesia
              </span>
            </div>
            
            {/* Main Title with Gradient Animation */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Temukan Produk
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Terbaik Untukmu
              </span>
            </h1>
            
            {/* Subtitle with Typewriter Effect */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              Dapatkan penawaran terbaik dari Shopee dan TikTok Shop. 
              Belanja lebih hemat dengan ribuan produk pilihan!
            </p>
            
            {/* Search Bar with 3D Effect */}
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative flex flex-col sm:flex-row gap-2 bg-background/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-primary/20">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Cari produk favoritmu..."
                      className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1 justify-center">
                    {['all', 'Shopee', 'TikTok'].map((platform) => (
                      <Button
                        key={platform}
                        variant={activeFilter === platform ? 'default' : 'ghost'}
                        onClick={() => handleFilter(platform)}
                        className={`transition-all duration-300 ${
                          activeFilter === platform 
                            ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg scale-105' 
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        {platform === 'all' ? 'Semua' : platform}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats with Counter Animation */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 animate-fade-in-up animation-delay-800">
              {[
                { value: '10K+', label: 'Produk', icon: Package },
                { value: '50K+', label: 'Customer', icon: Heart },
                { value: '100+', label: 'Brand', icon: Award },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-3">
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary/60 group-hover:text-primary transition-colors" />
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gradient-to-t from-primary to-primary/60 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Kenapa Pilih Kami?
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami menyediakan produk terbaik dengan harga terbaik dari berbagai platform terpercaya
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-muted hover:border-primary/30 transition-all duration-500 hover:shadow-xl animate-fade-in-up cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products with Carousel Effect */}
      {trendingProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl animate-pulse-ring">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    🔥 Trending Now
                  </h2>
                  <p className="text-muted-foreground">Produk paling populer minggu ini</p>
                </div>
              </div>
              <Link href="/products" className="group flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300">
                <span>Lihat Semua</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} onBuyClick={handleBuyClick} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-xl animate-bounce-subtle">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ✨ Produk Terbaru
            </h2>
            <p className="text-muted-foreground">Koleksi produk terbaru untukmu</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl">
                <Skeleton className="h-[450px] rounded-xl" />
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="text-6xl mb-4 animate-bounce-subtle">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground">Coba cari dengan kata kunci lain</p>
            <Button 
              variant="outline" 
              className="mt-4 gap-2"
              onClick={() => {
                setSearchTerm('')
                setSelectedPlatform('all')
                setActiveFilter('all')
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} onBuyClick={handleBuyClick} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex p-3 rounded-full bg-primary/20 mb-6 animate-pulse-ring">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
              Siap Berbelanja?
            </h2>
            <p className="text-muted-foreground mb-8 animate-fade-in-up animation-delay-200">
              Temukan ribuan produk menarik dengan harga terbaik hanya di Affiliate Store
            </p>
            <Button 
              size="lg" 
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg text-lg px-8 animate-fade-in-up animation-delay-400"
              onClick={() => {
                window.scrollTo({ top: document.getElementById('products')?.offsetTop || 0, behavior: 'smooth' })
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Belanja Sekarang
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
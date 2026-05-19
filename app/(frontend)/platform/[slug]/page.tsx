'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft, TrendingUp, Sparkles, ChevronRight, LayoutGrid, Search, Filter, Zap, Crown, Star, PartyPopper, ShoppingBag, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PlatformPage() {
  const params = useParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc'>('latest')
  const supabase = createClient()

  const platform = params.slug === 'shopee' ? 'Shopee' : 'TikTok'
  const platformConfig = {
    Shopee: {
      icon: '🛍️',
      name: 'Shopee',
      color: 'from-orange-500 to-red-500',
      bgPattern: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent',
      accent: 'orange',
      badgeColor: 'bg-orange-500'
    },
    TikTok: {
      icon: '🎵',
      name: 'TikTok',
      color: 'from-slate-700 to-slate-900',
      bgPattern: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent',
      accent: 'slate',
      badgeColor: 'bg-slate-700'
    }
  }
  
  const config = platformConfig[platform as keyof typeof platformConfig]

  useEffect(() => {
    fetchProducts()
  }, [params.slug])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('platform', platform)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
        break
      case 'price-desc':
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
        break
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    setFilteredProducts(filtered)
  }

  const handleBuyClick = async (productId: string) => {
    const product = products.find(p => p.id === productId)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      
      {/* Hero Section - Dynamic Platform Colors with Light/Dark support */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Gradient background yang adaptif */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-90 dark:opacity-100`} />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" />
          <div className={`absolute inset-0 ${config.bgPattern}`} />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-4 md:mb-6 gap-2 -ml-2 text-sm rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="text-4xl md:text-6xl mb-2 md:mb-3 animate-bounce">{config.icon}</div>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2">
                {config.name} <span className="text-white/80">Store</span>
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Temukan produk terbaik dari {config.name} dengan harga terbaik dan promo eksklusif
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full">
              <PartyPopper className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">{filteredProducts.length} Produk Tersedia</span>
            </div>
          </div>
        </div>
        
        {/* Wave bottom - adaptif untuk light/dark */}
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

      {/* Products Section */}
      <section className="py-6 md:py-12 container mx-auto px-4">
        {/* Filter Bar - Modern Design with Light/Dark support */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
              <LayoutGrid className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {filteredProducts.length} Produk
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3 w-3" />
              <span>Updated daily</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari produk keren..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-purple-500 rounded-xl text-sm h-10 md:h-11"
              />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer appearance-none"
              >
                <option value="latest">✨ Terbaru</option>
                <option value="price-asc">💰 Harga: Rendah → Tinggi</option>
                <option value="price-desc">💰 Harga: Tinggi → Rendah</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse">
                <div className="aspect-square" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="text-5xl md:text-6xl mb-4 animate-float">🔍</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">Produk tidak ditemukan</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6">Coba cari dengan kata kunci lain atau lihat produk lainnya</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="rounded-xl border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            >
              Reset Pencarian
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <ProductCard product={product} onBuyClick={handleBuyClick} />
                </div>
              ))}
            </div>
            
            {filteredProducts.length >= 24 && (
              <div className="text-center mt-8 md:mt-10">
                <Button variant="outline" className="rounded-xl gap-2 group border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50">
                  Load More
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
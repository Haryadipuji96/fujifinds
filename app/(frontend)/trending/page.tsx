'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Flame, ChevronRight, LayoutGrid, Filter, ShoppingBag, Music2, X, ArrowLeft, TrendingUp, Zap, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export default function TrendingPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'popular'>('popular')
  const supabase = createClient()

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedPlatform, sortBy])

  const fetchTrendingProducts = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_active', true)
        .eq('is_trending', true)
        .order('created_at', { ascending: false })

      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching trending products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform === selectedPlatform)
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
        break
      case 'price-desc':
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
        break
      case 'popular':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
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
      window.open(product.affiliate_link, '_blank')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedPlatform('all')
    setSortBy('popular')
  }

  const totalProducts = filteredProducts.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Tombol Kembali */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-4 md:mb-6 gap-2 -ml-2 text-sm rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          {/* Title & Description - Left Aligned */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Flame className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Trending 🔥
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Produk paling populer dan banyak dicari minggu ini. Update setiap hari dengan produk terbaru!
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

      {/* Products Section */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <LayoutGrid className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="text-xs md:text-sm text-slate-700 dark:text-white font-medium">
                {totalProducts} Produk Trending
              </span>
            </div>
            {(searchTerm || selectedPlatform !== 'all' || sortBy !== 'popular') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs hover:bg-red-200 transition-colors"
              >
                <X className="h-3 w-3" />
                Reset Filter
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari produk trending..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-red-500 rounded-xl text-sm h-10 md:h-11 text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            </div>
            
            {/* Platform Filter */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer appearance-none text-slate-800 dark:text-white"
              >
                <option value="all" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">📱 Semua Platform</option>
                <option value="Shopee" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">🛍️ Shopee</option>
                <option value="TikTok" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">🎵 TikTok</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer appearance-none text-slate-800 dark:text-white"
              >
                <option value="popular" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">🔥 Paling Populer</option>
                <option value="latest" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">✨ Terbaru</option>
                <option value="price-asc" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">💰 Harga: Rendah → Tinggi</option>
                <option value="price-desc" className="text-slate-800 dark:text-white bg-white dark:bg-slate-900">💰 Harga: Tinggi → Rendah</option>
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
            <div className="text-5xl md:text-6xl mb-4 animate-float">🔥</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-800 dark:text-white">Tidak ada produk trending</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6">
              Belum ada produk trending saat ini. Coba lagi nanti!
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="rounded-xl border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              Kembali ke Beranda
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                  <span>Ditemukan {totalProducts} produk trending</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  <span>Update setiap hari</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                <span>Paling populer minggu ini</span>
              </div>
            </div>

            {/* Product Grid */}
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
                <Button variant="outline" className="rounded-xl gap-2 group border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
                  Load More
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-red-50/30 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Kenapa Produk Ini Trending?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Produk trending dipilih berdasarkan jumlah pembelian, rating tinggi, dan popularitas di platform Shopee & TikTok Shop.
            Dapatkan produk terbaik sebelum kehabisan!
          </p>
        </div>
      </section>
    </div>
  )
}
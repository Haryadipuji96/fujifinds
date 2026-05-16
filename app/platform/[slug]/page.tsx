// app/platform/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft, Package, TrendingUp, Sparkles, Filter, ChevronRight, ShoppingBag } from 'lucide-react'
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
  const platformIcon = platform === 'Shopee' ? '🛍️' : '🎵'
  const platformColor = platform === 'Shopee' ? 'from-orange-500 to-orange-600' : 'from-black to-gray-800'

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r ${platformColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <div className="max-w-3xl">
            <div className="text-6xl mb-4 animate-bounce-subtle">{platformIcon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Produk {platform}
            </h1>
            <p className="text-lg text-white/80 mb-6 animate-fade-in-up animation-delay-200">
              Temukan produk terbaik dari {platform} dengan harga terbaik dan diskon spesial
            </p>
            <div className="flex items-center gap-4 text-sm animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>{products.length} Produk</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Update Setiap Hari</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filter & Sortir</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="latest">Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Menampilkan {filteredProducts.length} dari {products.length} produk
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl">
                <div className="h-96 bg-muted animate-pulse rounded-xl" />
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground mb-4">Coba cari dengan kata kunci lain</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="gap-2"
            >
              Reset Pencarian
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
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, ArrowLeft, Trash2, HeartPulse, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'

type WishlistItem = {
  id: string
  product_id: string
  user_id: string
  created_at: string
  products?: Product
}

export default function WishlistPage() {
  const router = useRouter()
  const { user } = useSupabase()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      // Jika user login, ambil dari database dengan user_id
      if (user) {
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (wishlistError) throw wishlistError

        if (wishlistData && wishlistData.length > 0) {
          const productIds = wishlistData.map(item => item.product_id)
          
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds)
            .eq('is_active', true)

          if (productsError) throw productsError

          const combined = wishlistData.map(wishlistItem => ({
            ...wishlistItem,
            products: productsData?.find(p => p.id === wishlistItem.product_id)
          })).filter(item => item.products)
          
          setWishlistItems(combined)
        } else {
          setWishlistItems([])
        }
      } 
      // Jika guest, ambil dari localStorage
      else {
        const guestId = localStorage.getItem('user_id')
        if (!guestId) {
          setWishlistItems([])
          setLoading(false)
          return
        }

        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist')
          .select('*')
          .eq('user_id', guestId)
          .order('created_at', { ascending: false })

        if (wishlistError) throw wishlistError

        if (wishlistData && wishlistData.length > 0) {
          const productIds = wishlistData.map(item => item.product_id)
          
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds)
            .eq('is_active', true)

          if (productsError) throw productsError

          const combined = wishlistData.map(wishlistItem => ({
            ...wishlistItem,
            products: productsData?.find(p => p.id === wishlistItem.product_id)
          })).filter(item => item.products)
          
          setWishlistItems(combined)
        } else {
          setWishlistItems([])
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Gagal memuat wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const guestId = localStorage.getItem('user_id')
        if (!guestId) return

        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', guestId)

        if (error) throw error
      }

      toast.success('Produk dihapus dari wishlist')
      fetchWishlist()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Gagal menghapus dari wishlist')
    }
  }

  const handleBuyClick = async (productId: string) => {
    const product = wishlistItems.find(item => item.product_id === productId)?.products
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

  const clearAllWishlist = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const guestId = localStorage.getItem('user_id')
        if (!guestId) return

        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', guestId)

        if (error) throw error
      }

      toast.success('Semua produk dihapus dari wishlist')
      fetchWishlist()
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Gagal membersihkan wishlist')
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [user])

  const totalItems = wishlistItems.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-200" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 mb-4 md:mb-6 gap-2 -ml-2 text-sm rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-white fill-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Wishlist Saya
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base">
              Koleksi produk favoritmu yang siap dibeli kapan saja
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

      {/* Wishlist Content */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-pink-100 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800">
              <HeartPulse className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
              <span className="text-xs md:text-sm text-slate-700 dark:text-white font-medium">
                {totalItems} Produk di Wishlist
              </span>
            </div>
            {totalItems > 0 && (
              <button
                onClick={clearAllWishlist}
                className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Hapus Semua
              </button>
            )}
          </div>
          
          <Link href="/product">
            <Button variant="outline" className="gap-2 rounded-xl border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50">
              <ShoppingBag className="h-4 w-4" />
              Lanjut Belanja
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
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
        ) : !user && totalItems === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="text-6xl md:text-7xl mb-4 animate-float">❤️</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-800 dark:text-white">Wishlist Masih Kosong</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6">
              Yuk, tambahkan produk favoritmu ke wishlist dengan klik icon ❤️ di produk
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/product">
                <Button className="rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <ShoppingBag className="h-4 w-4" />
                  Mulai Belanja
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="gap-2 rounded-xl border-purple-500 text-purple-600 dark:text-purple-400">
                  <LogIn className="h-4 w-4" />
                  Login untuk menyimpan wishlist permanen
                </Button>
              </Link>
            </div>
          </div>
        ) : totalItems === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="text-6xl md:text-7xl mb-4 animate-float">❤️</div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-800 dark:text-white">Wishlist Masih Kosong</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6">
              Belum ada produk di wishlist kamu. Yuk tambahkan!
            </p>
            <Link href="/product">
              <Button className="rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <ShoppingBag className="h-4 w-4" />
              Mulai Belanja
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {wishlistItems.map((item, index) => (
                <div key={item.id} className="relative group">
                  {item.products && (
                    <ProductCard 
                      product={item.products} 
                      onBuyClick={handleBuyClick} 
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromWishlist(item.product_id)
                    }}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {!user && totalItems > 0 && (
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  💡 <strong>Tips:</strong> Login untuk menyimpan wishlist secara permanen! Wishlist kamu akan tersimpan meskipun ganti perangkat.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="mt-2 gap-2">
                    <LogIn className="h-4 w-4" />
                    Login Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {wishlistItems.length > 0 && (
        <section className="py-8 md:py-12 bg-gradient-to-b from-pink-50/30 to-purple-50/30 dark:from-pink-950/20 dark:to-purple-950/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">
              💡 Tips Belanja
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              {user 
                ? "Produk di wishlist akan tetap tersimpan di akun kamu. Jangan sampai kehabisan ya!"
                : "Login sekarang untuk menyimpan wishlist secara permanen dan akses dari perangkat manapun!"
              }
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
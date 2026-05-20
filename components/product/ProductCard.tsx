'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, TrendingUp, Heart, Share2, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/utils'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/hooks/useSupabase'
import type { Product } from '@/types'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  onBuyClick?: (productId: string) => void
}

export function ProductCard({ product, onBuyClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const supabase = createClient()
  const { user } = useSupabase()
  
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const hasMultipleImages = product.images && product.images.length > 1
  const imageUrl = product.images?.[currentImageIndex]

  const getUserId = () => {
    if (user) return user.id
    let userId = localStorage.getItem('user_id')
    if (!userId) {
      userId = 'guest_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('user_id', userId)
    }
    return userId
  }

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const userId = getUserId()
        const { data, error } = await supabase
          .from('wishlist')
          .select('id')
          .eq('product_id', product.id)
          .eq('user_id', userId)
          .maybeSingle()
        
        if (error) throw error
        setIsWishlisted(!!data)
      } catch (error) {
        console.error('Error checking wishlist:', error)
        setIsWishlisted(false)
      }
    }
    
    checkWishlistStatus()
  }, [product.id, user])

  useEffect(() => {
    setImgError(false)
    setCurrentImageIndex(0)
  }, [product.id])

  useEffect(() => {
    setImgError(false)
  }, [currentImageIndex])

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const userId = getUserId()
      
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('product_id', product.id)
          .eq('user_id', userId)
        
        if (error) throw error
        setIsWishlisted(false)
        toast.success('Dihapus dari wishlist 💔')
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ 
            product_id: product.id, 
            user_id: userId 
          })
        
        if (error) throw error
        setIsWishlisted(true)
        if (!user) {
          toast.success('Ditambahkan ke wishlist ❤️ (Login untuk menyimpan permanen)')
        } else {
          toast.success('Ditambahkan ke wishlist ❤️')
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      toast.error('Gagal mengubah wishlist')
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`)
      toast.success('Link produk disalin!')
    } catch (error) {
      toast.error('Gagal menyalin link')
    }
  }

  const handleProductClick = () => {
    window.location.href = `/products/${product.slug}`
  }

  if (!imageUrl) {
    return (
      <div className="group relative bg-white dark:bg-white rounded-xl overflow-hidden border border-slate-200 dark:border-slate-200 hover:shadow-lg transition-all duration-300 product-card">
        <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-[10px]">No image</span>
          </div>
        </div>
        <div className="p-2.5">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs font-medium line-clamp-2 text-slate-700 dark:text-slate-800 hover:text-purple-600 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-700">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group relative bg-white dark:bg-white rounded-xl overflow-hidden border border-slate-200 dark:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
          onError={() => setImgError(true)}
          onLoad={() => setImgError(false)}
        />
        
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-100">
            <ImageOff className="h-8 w-8 text-slate-400" />
          </div>
        )}
        
        {/* Image indicator dots */}
        {hasMultipleImages && !imgError && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {product.images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentImageIndex === idx 
                    ? 'w-3 bg-white' 
                    : 'w-1 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-[10px] px-1.5 py-0.5 rounded-full">
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Platform Badge */}
        <Badge 
          className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded-full border-0 ${
            product.platform === 'Shopee' 
              ? 'bg-orange-500' 
              : 'bg-slate-700'
          }`}
        >
          {product.platform === 'Shopee' ? '🛍️ Shopee' : '🎵 TikTok'}
        </Badge>

        {/* Quick Action Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-7 w-7 p-0 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/products/${product.slug}`
            }}
          >
            <Eye className="h-3.5 w-3.5 text-slate-700" />
          </Button>
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onBuyClick?.(product.id)
            }}
            className="h-7 w-7 p-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <ShoppingCart className="h-3.5 w-3.5 text-white" />
          </Button>
          <button
            onClick={handleWishlist}
            className="h-7 w-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
          >
            <Heart className={`h-3.5 w-3.5 transition-all ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-2.5">
        <h3 className="text-xs font-medium line-clamp-2 text-slate-700 dark:text-slate-800 hover:text-purple-600 dark:hover:text-purple-600 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-2.5 w-2.5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-300'}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-600">(4.9)</span>
        </div>
        
        <div className="flex items-baseline gap-1 mt-1 flex-wrap">
          {product.discount_price ? (
            <>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-700">
                {formatPrice(product.discount_price)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-purple-600 dark:text-purple-700">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.is_trending && (
          <div className="flex items-center gap-0.5 mt-1">
            <TrendingUp className="h-2.5 w-2.5 text-orange-500" />
            <span className="text-[9px] text-orange-500">Trending</span>
          </div>
        )}

        <Button 
          size="sm"
          className="w-full mt-2 gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs py-1.5 h-auto rounded-lg md:hidden"
          onClick={(e) => {
            e.stopPropagation()
            onBuyClick?.(product.id)
          }}
        >
          <ShoppingCart className="h-3 w-3" />
          Beli Sekarang
        </Button>
      </div>
    </div>
  )
}
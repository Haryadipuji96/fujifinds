// components/product/ProductCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, TrendingUp, Heart, Share2, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/utils'
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
  
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const hasMultipleImages = product.images && product.images.length > 1
  const imageUrl = product.images?.[currentImageIndex]

  // Reset error ketika product berubah ATAU image index berubah
  useEffect(() => {
    setImgError(false)
    setCurrentImageIndex(0) // Reset ke index pertama ketika product berganti
  }, [product.id]) // Tambahkan dependency product.id

  useEffect(() => {
    setImgError(false)
  }, [currentImageIndex])

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist')
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

  const handleImageError = () => {
    console.log('Image failed to load:', imageUrl) // Debug log
    setImgError(true)
  }

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl) // Debug log
    setImgError(false)
  }

  // Jika tidak ada imageUrl sama sekali
  if (!imageUrl) {
    return (
      <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-12 w-12" />
            <span className="text-xs">Gambar tidak tersedia</span>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 z-10 pointer-events-none ${isHovered ? 'opacity-100' : ''}`} />
      
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-muted to-muted/50">
        {/* Selalu coba render Image, jangan pake conditional yang terlalu strict */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority={currentImageIndex === 0}
        />
        
        {/* Tampilkan overlay error jika gambar gagal load */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/90 backdrop-blur-sm">
            <ImageOff className="h-12 w-12 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Gambar tidak tersedia</span>
          </div>
        )}
        
        {/* Image indicator dots */}
        {hasMultipleImages && !imgError && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentImageIndex === idx 
                    ? 'w-4 bg-white' 
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Animated shine effect */}
        <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none ${isHovered ? 'translate-x-full' : ''}`} />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 animate-pulse z-20 shadow-lg text-white border-0">
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Platform Badge */}
        <Badge 
          className={`absolute top-3 left-3 z-20 shadow-lg backdrop-blur-sm border-0 ${
            product.platform === 'Shopee' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
              : 'bg-gradient-to-r from-black to-gray-800'
          }`}
        >
          {product.platform === 'Shopee' ? '🛍️' : '🎵'} {product.platform}
        </Badge>

        {/* Trending Badge */}
        {product.is_trending && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            <TrendingUp className="h-3 w-3" />
            Trending
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/50 backdrop-blur-sm transition-all duration-500 z-20 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <Link href={`/products/${product.slug}`}>
            <Button 
              size="sm" 
              variant="secondary" 
              className="gap-2 transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <Eye className="h-4 w-4" />
              Detail
            </Button>
          </Link>
          <Button 
            size="sm"
            onClick={() => onBuyClick?.(product.id)}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ShoppingCart className="h-4 w-4" />
            Beli
          </Button>
        </div>
      </div>
      
      {/* Content - same as before */}
      <CardContent className="p-4 space-y-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.rating || 0})</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlist}
              className="p-1 rounded-full hover:bg-red-500/10 transition-colors"
            >
              <Heart className={`h-3.5 w-3.5 transition-all ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 flex-wrap">
          {product.discount_price ? (
            <>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(product.discount_price)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-3 md:hidden">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="h-3 w-3" />
              Detail
            </Button>
          </Link>
          <Button 
            size="sm"
            className="flex-1 gap-1 bg-gradient-to-r from-primary to-primary/80"
            onClick={() => onBuyClick?.(product.id)}
          >
            <ShoppingCart className="h-3 w-3" />
            Beli
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
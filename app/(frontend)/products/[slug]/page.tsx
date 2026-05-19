'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Share2, Star, ArrowLeft, Heart, Eye, Shield, Truck, Clock, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Link as LinkIcon, Zap, Crown, Gem, PartyPopper } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (params.slug) {
            fetchProduct()
        }
        window.scrollTo(0, 0)
    }, [params.slug])

    const fetchProduct = async () => {
        setLoading(true)

        const { data: productData, error: productError } = await supabase
            .from('products')
            .select('*, categories(*)')
            .eq('slug', params.slug)
            .eq('is_active', true)
            .single()

        if (productError || !productData) {
            console.error('Product not found:', productError)
            router.push('/')
            return
        }

        setProduct(productData)

        if (productData.category_id) {
            const { data: relatedData } = await supabase
                .from('products')
                .select('*, categories(*)')
                .eq('category_id', productData.category_id)
                .eq('is_active', true)
                .neq('id', productData.id)
                .limit(6)

            if (relatedData) {
                setRelatedProducts(relatedData)
            }
        }

        setLoading(false)
    }

    const handleBuyClick = async (productId?: string) => {
        const targetProduct = productId ? relatedProducts.find(p => p.id === productId) : product
        if (!targetProduct) return

        try {
            await fetch('/api/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: targetProduct.id,
                    product_name: targetProduct.name,
                    platform: targetProduct.platform
                })
            })

            window.open(targetProduct.affiliate_link, '_blank')
            toast.success('Redirecting to store...')
        } catch (error) {
            console.error('Error tracking click:', error)
            window.open(targetProduct.affiliate_link, '_blank')
        }
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success('Link produk disalin! 🎉')
        } catch (error) {
            toast.error('Gagal menyalin link')
        }
    }

    const nextImage = () => {
        if (product?.images && selectedImage < product.images.length - 1) {
            setSelectedImage(selectedImage + 1)
        }
    }

    const prevImage = () => {
        if (selectedImage > 0) {
            setSelectedImage(selectedImage - 1)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
                <div className="container mx-auto px-4 py-4 md:py-8">
                    <div className="animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-32 mb-4 md:mb-6" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            <div className="h-[300px] md:h-[400px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl md:rounded-2xl" />
                            <div className="space-y-4">
                                <div className="h-7 md:h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2" />
                                <div className="h-10 md:h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                                <div className="h-20 md:h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                                <div className="h-10 md:h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950">
                <div className="container mx-auto px-4 py-16 md:py-20 text-center">
                    <div className="text-5xl md:text-6xl mb-4 animate-bounce">🔍</div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-slate-800 dark:text-slate-200">Produk tidak ditemukan</h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6">Produk yang Anda cari tidak tersedia atau telah dihapus</p>
                    <Button onClick={() => router.push('/')} className="rounded-xl gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        )
    }

    const discountPercentage = product.discount_price
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-4 md:py-8">
                {/* Breadcrumb - Modern dengan Light/Dark support */}
                <div className="mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/" className="hover:text-purple-500 transition-colors flex items-center gap-1">
                            🏠 Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href={`/platform/${product.platform.toLowerCase()}`} className="hover:text-purple-500 transition-colors">
                            {product.platform}
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px] md:max-w-[200px]">{product.name}</span>
                    </div>
                </div>

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 md:mb-6 gap-2 group -ml-2 text-sm rounded-full"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Kembali
                </Button>

                {/* Product Detail - Grid Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="relative group">
                        <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <Image
                                src={product.images?.[selectedImage] || '/placeholder-product.jpg'}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            {discountPercentage > 0 && (
                                <Badge className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm shadow-lg rounded-full animate-pulse">
                                    -{discountPercentage}% 🔥
                                </Badge>
                            )}
                            
                            <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
                                <div className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] md:text-xs">
                                    {product.platform === 'Shopee' ? '🛍️ Shopee Mall' : '🎵 TikTok Shop'}
                                </div>
                            </div>
                            
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 hover:scale-110 transition-all"
                                    >
                                        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 hover:scale-110 transition-all"
                                    >
                                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails - Responsive */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                                            selectedImage === index 
                                                ? 'border-purple-500 shadow-lg scale-105' 
                                                : 'border-transparent hover:border-purple-500/50'
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 md:space-y-5">
                        {/* Title */}
                        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                            {product.name}
                        </h1>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < (product.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                ))}
                            </div>
                            <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">4.9 (1.2k+ reviews)</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3 md:h-3.5 md:w-3.5 text-purple-500" />
                                <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">2.3k+ terjual</span>
                            </div>
                        </div>

                        {/* Price Section - Glassmorphism */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl md:rounded-2xl p-4 md:p-5 border border-purple-200 dark:border-purple-800/30">
                            {product.discount_price ? (
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            {formatPrice(product.discount_price)}
                                        </span>
                                        <span className="text-sm md:text-base text-slate-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 rounded-full text-[10px] md:text-xs px-1.5 py-0.5 md:px-2">
                                            Hemat {formatPrice(product.price - product.discount_price)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-green-600 dark:text-green-400">
                                        <Zap className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                        <span>Limited time offer! Berakhir dalam 2 hari</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                            
                            {/* Delivery Info */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-purple-200 dark:border-purple-800/30">
                                {[
                                    { icon: Truck, text: 'Gratis Ongkir', color: 'text-orange-500' },
                                    { icon: Shield, text: 'Garansi 100%', color: 'text-green-500' },
                                    { icon: Clock, text: 'Pengiriman Cepat', color: 'text-blue-500' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-slate-600 dark:text-slate-400">
                                        <item.icon className={`h-3 w-3 md:h-3.5 md:w-3.5 ${item.color}`} />
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Deskripsi Produk
                            </h3>
                            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-800">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-600 dark:text-green-400">Ready Stock</span>
                            <span className="text-slate-400 mx-1 md:mx-2">•</span>
                            <span className="text-slate-500 dark:text-slate-400">Guaranteed authentic</span>
                        </div>

                        {/* Action Buttons - Responsive */}
                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
                            <Button 
                                size="lg" 
                                className="flex-1 gap-2 relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg rounded-xl text-sm md:text-base py-5 md:py-6"
                                onClick={() => handleBuyClick()}
                            >
                                <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Beli Sekarang</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="gap-2 group rounded-xl text-sm md:text-base border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                                onClick={handleShare}
                            >
                                <Share2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                                Bagikan
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className={`gap-2 transition-all duration-300 rounded-xl text-sm md:text-base ${
                                    isWishlisted 
                                        ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800' 
                                        : 'border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                                }`}
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted)
                                    toast.success(isWishlisted ? '💔 Dihapus dari wishlist' : '❤️ Ditambahkan ke wishlist')
                                }}
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500 animate-pulse' : ''} transition-all duration-300`} />
                                Wishlist
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { icon: CheckCircle, text: 'Pembayaran Aman', color: 'text-green-500' },
                                { icon: Shield, text: 'Link Resmi', color: 'text-blue-500' },
                                { icon: Clock, text: '24/7 Support', color: 'text-purple-500' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                                    <item.icon className={`h-3 w-3 md:h-3.5 md:w-3.5 ${item.color}`} />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products - Responsive Grid */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    Kamu Mungkin Juga Suka
                                </h2>
                                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Produk rekomendasi untukmu</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                            {relatedProducts.map((relatedProduct, index) => (
                                <div
                                    key={relatedProduct.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                                >
                                    <ProductCard
                                        product={relatedProduct}
                                        onBuyClick={() => handleBuyClick(relatedProduct.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
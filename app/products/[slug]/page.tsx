// app/products/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Share2, Star, ArrowLeft, Heart, Eye, Shield, Truck, Clock, ChevronLeft, ChevronRight, CheckCircle, Link, Sparkles } from 'lucide-react'
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
    const [quantity, setQuantity] = useState(1)
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
                .limit(4)

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
            toast.success('Link produk disalin!')
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
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-32 mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-[500px] bg-muted rounded-xl" />
                        <div className="space-y-4">
                            <div className="h-8 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="h-12 bg-muted rounded w-1/3" />
                            <div className="h-24 bg-muted rounded" />
                            <div className="h-12 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center min-h-screen">
                <div className="animate-fade-in-up">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
                    <p className="text-muted-foreground mb-6">Produk yang Anda cari tidak tersedia atau telah dihapus</p>
                    <Button onClick={() => router.push('/')} className="gap-2">
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

    const currentPrice = product.discount_price || product.price

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Breadcrumb */}
            <div className="mb-6 animate-fade-in-up">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href={`/platform/${product.platform.toLowerCase()}`} className="hover:text-primary transition-colors">
                        {product.platform}
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 gap-2 group animate-fade-in-up animation-delay-100"
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Kembali
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery with 3D Effect */}
                <div className="animate-fade-in-up animation-delay-200">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                            <Image
                                src={product.images?.[selectedImage] || '/placeholder-product.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            {discountPercentage > 0 && (
                                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-base px-3 py-1.5 shadow-lg animate-bounce-subtle">
                                    -{discountPercentage}%
                                </Badge>
                            )}
                            
                            {/* Image Navigation Buttons */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                                        selectedImage === index 
                                            ? 'border-primary shadow-lg scale-105' 
                                            : 'border-transparent hover:border-primary/50'
                                    }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info with Sticky */}
                <div className="lg:sticky lg:top-24 h-fit animate-fade-in-up animation-delay-400">
                    <div className="space-y-6">
                        {/* Platform Badge */}
                        <Badge className={`w-fit ${product.platform === 'Shopee' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-black to-gray-800'} text-white border-0 px-3 py-1.5 text-sm shadow-lg`}>
                            {product.platform === 'Shopee' ? '🛍️ Shopee' : '🎵 TikTok Shop'}
                        </Badge>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>

                        {/* Rating & Category */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < (product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">({product.rating || 0} rating)</span>
                            </div>
                            {product.category && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>•</span>
                                    <span>Kategori: {product.category.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-2xl p-6 border border-primary/10">
                            {product.discount_price ? (
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-primary">
                                            {formatPrice(product.discount_price)}
                                        </span>
                                        <span className="text-lg text-muted-foreground line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <Badge className="bg-green-500 text-white border-0">
                                            Hemat {formatPrice(product.price - product.discount_price)}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-4xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                            
                            {/* Payment Info */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-primary/10">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span>Gratis Ongkir</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span>Garansi 100%</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Pengiriman Cepat</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                Deskripsi Produk
                            </h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button 
                                size="lg" 
                                className="flex-1 gap-2 relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg text-base py-6"
                                onClick={() => handleBuyClick()}
                            >
                                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span>Beli Sekarang</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="gap-2 group"
                                onClick={handleShare}
                            >
                                <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                Bagikan
                            </Button>
                            
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className={`gap-2 transition-all duration-300 ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500' : ''}`}
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted)
                                    toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist')
                                }}
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''} transition-all duration-300 ${isWishlisted ? 'scale-110' : ''}`} />
                                Wishlist
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 pt-6 border-t">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Pembayaran Aman</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>Link Resmi</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-4 w-4 text-green-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-8 border-t">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-xl">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Produk Terkait</h2>
                            <p className="text-muted-foreground text-sm">Produk lain yang mungkin Anda suka</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct, index) => (
                            <div
                                key={relatedProduct.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
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
    )
}
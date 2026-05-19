'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Package, ArrowLeft, CheckCircle, Sparkles, Tag, Link2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { addProduct, uploadImages } from '../actions'
import Link from 'next/link'

type Category = {
  id: string
  name: string
  slug: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    affiliate_link: '',
    platform: 'Shopee',
    category_id: '',
    is_trending: false
  })



  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')
    
    if (data) {
      setCategories(data)
    }
  }

    useEffect(() => {
    fetchCategories()
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imageFiles.length + files.length > 5) {
      toast.error('Maksimal 5 gambar')
      return
    }

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Gambar ${file.name} terlalu besar (maks 2MB)`)
        return
      }
      
      setImageFiles(prev => [...prev, file])
      const preview = URL.createObjectURL(file)
      setImagePreviews(prev => [...prev, preview])
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) return []
    
    setUploading(true)
    
    const uploadFormData = new FormData()
    imageFiles.forEach(file => {
      uploadFormData.append('files', file)
    })
    
    const result = await uploadImages(uploadFormData)
    
    setUploading(false)
    
    if (result.error) {
      toast.error('Gagal upload gambar: ' + result.error)
      return []
    }
    
    setImageUrls(result.urls || [])
    toast.success(`${result.urls?.length} gambar berhasil diupload`)
    return result.urls || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (imageFiles.length === 0) {
      toast.error('Minimal upload 1 gambar produk')
      return
    }

    setLoading(true)

    try {
      const uploadedUrls = await handleUploadImages()

      if (uploadedUrls.length === 0) {
        throw new Error('Gagal upload gambar')
      }

      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      submitFormData.append('description', formData.description)
      submitFormData.append('price', formData.price)
      submitFormData.append('discount_price', formData.discount_price)
      submitFormData.append('affiliate_link', formData.affiliate_link)
      submitFormData.append('platform', formData.platform)
      submitFormData.append('category_id', formData.category_id)
      submitFormData.append('is_trending', formData.is_trending.toString())
      submitFormData.append('image_urls', JSON.stringify(uploadedUrls))

      const result = await addProduct(submitFormData)

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success('Produk berhasil ditambahkan!')
      router.push('/admin/products')
      
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
      
    } catch (error: any) {
      toast.error('Gagal menambah produk: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="gap-2 group text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/20">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#FF006E] to-[#00D4FF] bg-clip-text text-transparent animate-gradient">
                Tambah Produk Baru
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Isi informasi produk dengan lengkap</p>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00D4FF]/5 to-[#FF006E]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-xl bg-[#00D4FF]/10">
                <Sparkles className="h-4 w-4 text-[#00D4FF]" />
              </div>
              Informasi Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nama Produk */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-[#00D4FF]" />
                Nama Produk <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                required
                placeholder="Contoh: Smartphone XYZ Pro Max"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 transition-all duration-300"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-slate-300">Deskripsi Produk</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Jelaskan detail produk, spesifikasi, keunggulan, dll..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 resize-none transition-all duration-300"
              />
            </div>

            {/* Harga */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  Harga <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">Rp</span>
                  <Input
                    id="price"
                    type="number"
                    required
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 pl-10 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_price" className="text-sm font-medium text-slate-300">Harga Diskon</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">Rp</span>
                  <Input
                    id="discount_price"
                    type="number"
                    placeholder="0"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 pl-10 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Link Affiliate */}
            <div className="space-y-2">
              <Label htmlFor="affiliate_link" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-[#FF006E]" />
                Link Affiliate <span className="text-red-400">*</span>
              </Label>
              <Input
                id="affiliate_link"
                required
                type="url"
                placeholder="https://shopee.co.id/... atau https://vt.tiktok.com/..."
                value={formData.affiliate_link}
                onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 transition-all duration-300"
              />
            </div>

            {/* Platform & Kategori */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-sm font-medium text-slate-300">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-[#00D4FF] transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="Shopee">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400">🛍️</span> Shopee
                      </div>
                    </SelectItem>
                    <SelectItem value="TikTok">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">🎵</span> TikTok
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-slate-300">Kategori</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-[#00D4FF] transition-all duration-300">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gambar Produk */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-[#00D4FF]" />
                Gambar Produk <span className="text-red-400">*</span> (Maks 5)
              </Label>
              <div className="border-2 border-dashed border-[#00D4FF]/30 rounded-xl p-6 text-center hover:border-[#00D4FF]/60 transition-all duration-300 group bg-slate-800/30">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex flex-col items-center gap-2"
                >
                  <div className="p-3 rounded-full bg-[#00D4FF]/10 group-hover:bg-[#00D4FF]/20 transition-all duration-300">
                    <Upload className="h-6 w-6 text-[#00D4FF]" />
                  </div>
                  <span className="text-sm font-medium text-white">Klik untuk upload gambar</span>
                  <span className="text-xs text-slate-500">JPG, PNG, GIF (maks 2MB per gambar)</span>
                </Label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group/image">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover group-hover/image:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trending Checkbox */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-[#FF006E]/10 border border-[#00D4FF]/20">
              <input
                type="checkbox"
                id="is_trending"
                checked={formData.is_trending}
                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                className="h-4 w-4 rounded border-[#00D4FF]/30 text-[#00D4FF] focus:ring-[#00D4FF]/20 bg-slate-800"
              />
              <Label htmlFor="is_trending" className="cursor-pointer font-medium text-white">
                Jadikan sebagai produk trending
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group bg-gradient-to-r from-[#00D4FF] to-[#FF006E] hover:from-[#00D4FF]/90 hover:to-[#FF006E]/90 shadow-lg shadow-[#00D4FF]/25 py-6 text-lg rounded-xl"
              disabled={loading || uploading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold">
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Mengupload gambar...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Menyimpan produk...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Simpan Produk
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
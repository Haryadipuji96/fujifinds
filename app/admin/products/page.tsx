'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Package, Filter, TrendingUp, Sparkles, Search, RefreshCw, ShoppingBag, Zap, Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, platformFilter, statusFilter, products])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
    
    setProducts(data || [])
    setLoading(false)
  }

  const filterProducts = () => {
    let filtered = [...products]
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (platformFilter !== 'all') {
      filtered = filtered.filter(p => p.platform === platformFilter)
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => 
        statusFilter === 'active' ? p.is_active : !p.is_active
      )
    }
    
    setFilteredProducts(filtered)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Gagal menghapus produk')
    } else {
      toast.success('Produk berhasil dihapus')
      fetchProducts()
    }
    setDeleteId(null)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      toast.error('Gagal mengupdate status')
    } else {
      toast.success('Status berhasil diupdate')
      fetchProducts()
    }
  }

  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active).length
  const shopeeProducts = products.filter(p => p.platform === 'Shopee').length
  const tiktokProducts = products.filter(p => p.platform === 'TikTok').length

  const handleAddProduct = () => {
    router.push('/admin/products/add')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/20">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#FF006E] to-[#00D4FF] bg-clip-text text-transparent animate-gradient">
                Manajemen Produk
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Kelola semua produk affiliate Anda</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-[#00D4FF] to-[#FF006E] hover:from-[#00D4FF]/90 hover:to-[#FF006E]/90 shadow-lg shadow-[#00D4FF]/25 rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 hover:border-[#00D4FF]/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#00D4FF]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-xs text-slate-400">Total Produk</p>
            <p className="text-2xl font-bold text-[#00D4FF]">{totalProducts}</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 hover:border-emerald-500/50 transition-all duration-300">
          <div className="relative z-10">
            <p className="text-xs text-slate-400">Produk Aktif</p>
            <p className="text-2xl font-bold text-emerald-400">{activeProducts}</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 hover:border-orange-500/50 transition-all duration-300">
          <div className="relative z-10">
            <p className="text-xs text-slate-400">Shopee</p>
            <p className="text-2xl font-bold text-orange-400">{shopeeProducts}</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 hover:border-purple-500/50 transition-all duration-300">
          <div className="relative z-10">
            <p className="text-xs text-slate-400">TikTok</p>
            <p className="text-2xl font-bold text-purple-400">{tiktokProducts}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-1.5 rounded-xl bg-[#00D4FF]/10">
              <Filter className="h-4 w-4 text-[#00D4FF]" />
            </div>
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20 pl-10"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-700 text-white focus:border-[#00D4FF]">
                <SelectValue placeholder="Semua Platform" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Semua Platform</SelectItem>
                <SelectItem value="Shopee">Shopee</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-slate-800/50 border-slate-700 text-white focus:border-[#00D4FF]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setPlatformFilter('all')
                setStatusFilter('all')
              }} 
              className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-1.5 rounded-xl bg-[#00D4FF]/10">
              <Grid3x3 className="h-4 w-4 text-[#00D4FF]" />
            </div>
            Daftar Produk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800/50 border-slate-700">
                  <TableHead className="min-w-[200px] text-slate-300">Nama Produk</TableHead>
                  <TableHead className="w-[100px] text-slate-300">Platform</TableHead>
                  <TableHead className="w-[120px] text-slate-300">Harga</TableHead>
                  <TableHead className="w-[100px] text-slate-300">Status</TableHead>
                  <TableHead className="w-[140px] text-right text-slate-300">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <div className="h-5 w-5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      Belum ada produk
                      <div className="mt-3">
                        <Button onClick={() => router.push('/admin/products/add')} size="sm" className="bg-gradient-to-r from-[#00D4FF] to-[#FF006E]">
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Produk Pertama
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-800/50 transition-colors border-slate-700">
                      <TableCell className="font-medium text-white">
                        <div className="max-w-[250px] break-words">
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${product.platform === 'Shopee' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'} whitespace-nowrap`}>
                          {product.platform === 'Shopee' ? '🛍️ Shopee' : '🎵 TikTok'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-slate-300">{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_active ? 'default' : 'secondary'}
                          className={`cursor-pointer transition-all duration-300 whitespace-nowrap ${
                            product.is_active 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' 
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30'
                          }`}
                          onClick={() => toggleActive(product.id, product.is_active)}
                        >
                          {product.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Button variant="outline" size="sm" type="button" className="h-8 w-8 p-0 border-slate-700 hover:border-[#00D4FF] hover:text-[#00D4FF]">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="outline" size="sm" type="button" className="h-8 w-8 p-0 border-slate-700 hover:border-[#00D4FF] hover:text-[#00D4FF]">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            type="button"
                            className="h-8 w-8 p-0 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Produk yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
// app/admin/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Package, Filter, TrendingUp, Sparkles, Search, RefreshCw } from 'lucide-react'
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
    console.log('Navigating to add product...')
    router.push('/admin/products/add')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-xl">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Manajemen Produk
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">Kelola semua produk affiliate Anda</p>
        </div>
        {/* Tombol Tambah Produk - Sederhana tanpa efek absolute yang mengganggu */}
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg cursor-pointer relative z-10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground">Total Produk</p>
            <p className="text-2xl font-bold text-primary">{totalProducts}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground">Produk Aktif</p>
            <p className="text-2xl font-bold text-green-500">{activeProducts}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground">Shopee</p>
            <p className="text-2xl font-bold text-orange-500">{shopeeProducts}</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 border border-black/20 dark:border-white/20 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground">TikTok</p>
            <p className="text-2xl font-bold text-black dark:text-white">{tiktokProducts}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-xl transition-all duration-500 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Semua Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Platform</SelectItem>
                <SelectItem value="Shopee">Shopee</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setPlatformFilter('all')
              setStatusFilter('all')
            }} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="hover:shadow-xl transition-all duration-500 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            Daftar Produk
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      Belum ada produk
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <TableRow 
                      key={product.id} 
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge className={`${product.platform === 'Shopee' ? 'bg-orange-500' : 'bg-black'} hover:opacity-80 transition-opacity`}>
                          {product.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.is_active ? 'default' : 'secondary'}
                          className={`cursor-pointer transition-all duration-300 ${
                            product.is_active 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-500 hover:bg-gray-600'
                          }`}
                          onClick={() => toggleActive(product.id, product.is_active)}
                        >
                          {product.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Button variant="outline" size="sm" type="button">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="outline" size="sm" type="button">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            type="button"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
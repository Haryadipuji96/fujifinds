// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, DollarSign, Zap, BarChart3, Users, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar
} from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalClicks: 0,
    shopeeClicks: 0,
    tiktokClicks: 0,
    previousTotalClicks: 0
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  const fetchStats = async () => {
    // Total produk
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Total klik
    const { data: clicks } = await supabase
      .from('click_logs')
      .select('platform, clicked_at')

    const shopeeClicks = clicks?.filter(c => c.platform === 'Shopee').length || 0
    const tiktokClicks = clicks?.filter(c => c.platform === 'TikTok').length || 0

    // Get previous period clicks (last month)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const previousClicks = clicks?.filter(c => new Date(c.clicked_at) < lastMonth).length || 0

    setStats({
      totalProducts: productCount || 0,
      totalClicks: clicks?.length || 0,
      shopeeClicks,
      tiktokClicks,
      previousTotalClicks: previousClicks
    })
    setLoading(false)
  }

  const fetchChartData = async () => {
    const { data: clicks } = await supabase
      .from('click_logs')
      .select('clicked_at, platform')
      .order('clicked_at', { ascending: true })

    if (clicks) {
      // Group by date with platform breakdown
      const grouped: any = {}
      clicks.forEach((click) => {
        const date = new Date(click.clicked_at).toLocaleDateString()
        if (!grouped[date]) {
          grouped[date] = { date, Shopee: 0, TikTok: 0, total: 0 }
        }
        grouped[date][click.platform]++
        grouped[date].total++
      })

      const data = Object.entries(grouped)
        .map(([_, value]: [string, any]) => value)
        .slice(-14) // Last 14 days

      setChartData(data as any)
      setLastUpdated(new Date())
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    await fetchStats()
    await fetchChartData()
    setLoading(false)
  }

  const growth = stats.previousTotalClicks > 0 
    ? ((stats.totalClicks - stats.previousTotalClicks) / stats.previousTotalClicks * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-xl animate-pulse">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">Selamat datang di admin panel affiliate Anda</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 group"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-sm">Refresh Data</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {loading ? <div className="h-8 w-16 bg-primary/20 rounded animate-pulse" /> : stats.totalProducts}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Produk</div>
            <div className="mt-3 h-1 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${Number(growth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Number(growth) >= 0 ? '+' : ''}{growth}%
                </span>
                {Number(growth) >= 0 ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {loading ? <div className="h-8 w-16 bg-orange-500/20 rounded animate-pulse" /> : stats.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total Klik</div>
            <div className="mt-3 h-1 w-full bg-orange-500/20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-orange-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-xs text-muted-foreground">Platform</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {loading ? <div className="h-8 w-16 bg-orange-500/20 rounded animate-pulse" /> : stats.shopeeClicks.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Klik Shopee</div>
            <div className="mt-3 h-1 w-full bg-orange-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{ width: `${stats.totalClicks ? (stats.shopeeClicks / stats.totalClicks * 100) : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 border border-black/20 dark:border-white/20 p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-black/20 dark:bg-white/20 group-hover:bg-black/30 dark:group-hover:bg-white/30 transition-colors">
                <DollarSign className="h-5 w-5 text-black dark:text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Platform</span>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white">
              {loading ? <div className="h-8 w-16 bg-black/20 rounded animate-pulse" /> : stats.tiktokClicks.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Klik TikTok</div>
            <div className="mt-3 h-1 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full animate-pulse" style={{ width: `${stats.totalClicks ? (stats.tiktokClicks / stats.totalClicks * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-orange-500/20">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            Statistik Klik 14 Hari Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000000" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#f97316" 
                    fill="url(#areaGradient)"
                    strokeWidth={2}
                  />
                  <Bar dataKey="Shopee" barSize={30} fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="TikTok" barSize={30} fill="#000000" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {loading ? 'Loading data...' : 'Belum ada data klik'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 group hover:scale-105 transition-all duration-300">
          <div className="p-3 rounded-full bg-orange-500/20">
            <TrendingUp className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CTR Rate</p>
            <p className="text-xl font-bold text-orange-500">+{growth}%</p>
            <p className="text-xs text-muted-foreground">vs bulan lalu</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 group hover:scale-105 transition-all duration-300">
          <div className="p-3 rounded-full bg-primary/20">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
            <p className="text-xl font-bold text-primary">-</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 group hover:scale-105 transition-all duration-300">
          <div className="p-3 rounded-full bg-green-500/20">
            <Zap className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-xl font-bold text-green-500">-</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
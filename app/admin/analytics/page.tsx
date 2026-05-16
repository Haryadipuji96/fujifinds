// app/admin/analytics/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { TrendingUp, ShoppingBag, MousePointerClick, Zap, Activity, RefreshCw } from 'lucide-react'

type ClickLog = {
  product_name: string
  platform: string
  clicked_at: string
}

type ProductStat = {
  name: string
  clicks: number
}

type PlatformStat = {
  name: string
  value: number
}

const COLORS = ['#f97316', '#000000', '#3b82f6', '#10b981', '#8b5cf6']

export default function AnalyticsPage() {
  const [topProducts, setTopProducts] = useState<ProductStat[]>([])
  const [platformData, setPlatformData] = useState<PlatformStat[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async (): Promise<void> => {
    setLoading(true)
    // Top products by clicks
    const { data: clicksData } = await supabase
      .from('click_logs')
      .select('product_name, platform, clicked_at')

    const clicks: ClickLog[] = Array.isArray(clicksData)
      ? (clicksData as any[]).map((item) => ({
          product_name: String(item.product_name ?? ''),
          platform: String(item.platform ?? ''),
          clicked_at: String(item.clicked_at ?? '')
        }))
      : []

    const productStats = clicks.reduce<Record<string, number>>((acc, click) => {
      acc[click.product_name] = (acc[click.product_name] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topProductsList: ProductStat[] = Object.entries(productStats)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    setTopProducts(topProductsList)

    // Platform distribution
    const shopeeCount = clicks.filter((c) => c.platform === 'Shopee').length
    const tiktokCount = clicks.filter((c) => c.platform === 'TikTok').length

    setPlatformData([
      { name: 'Shopee', value: shopeeCount },
      { name: 'TikTok', value: tiktokCount }
    ])

    // Trend data last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString()
    }).reverse()

    const trendMap: Record<string, number> = {}
    last7Days.forEach(date => { trendMap[date] = 0 })
    
    clicks.forEach(click => {
      const date = new Date(click.clicked_at).toLocaleDateString()
      if (trendMap[date] !== undefined) {
        trendMap[date]++
      }
    })

    const trendDataList = last7Days.map(date => ({
      date: date.split('/').slice(0, 2).join('/'),
      clicks: trendMap[date]
    }))

    setTrendData(trendDataList)
    setLastUpdated(new Date())
    setLoading(false)
  }

  const totalClicks = platformData.reduce((sum, item) => sum + item.value, 0)
  const shopeePercentage = platformData[0] ? ((platformData[0].value / totalClicks) * 100).toFixed(1) : 0
  const tiktokPercentage = platformData[1] ? ((platformData[1].value / totalClicks) * 100).toFixed(1) : 0

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">Statistik performa affiliate secara real-time</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 group"
        >
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm">Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <ShoppingBag className="h-5 w-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{totalClicks.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Klik</div>
            <div className="mt-3 h-1 w-full bg-orange-500/20 rounded-full overflow-hidden">
              <div className="h-full w-full bg-orange-500 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 hover:scale-105 transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-5 w-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Share</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{shopeePercentage}%</div>
            <div className="text-sm text-muted-foreground mt-1">Shopee Share</div>
            <div className="mt-3 h-1 w-full bg-orange-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${shopeePercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-black/10 to-black/5 border border-black/20 p-6 hover:scale-105 transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Activity className="h-5 w-5 text-black dark:text-white" />
              <span className="text-xs text-muted-foreground">Share</span>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white">{tiktokPercentage}%</div>
            <div className="text-sm text-muted-foreground mt-1">TikTok Share</div>
            <div className="mt-3 h-1 w-full bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000" style={{ width: `${tiktokPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 hover:scale-105 transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <MousePointerClick className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Peak</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {Math.max(...trendData.map(d => d.clicks), 0)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Klik Tertinggi/Hari</div>
            <div className="mt-3 h-1 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart Card */}
        <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              Tren Klik 7 Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#000000" />
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
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="url(#lineGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#f97316' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Belum ada data klik
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products Card */}
        <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              Produk Paling Banyak Diklik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#f97316" radius={[0, 4, 4, 0]}>
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Belum ada data klik
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500/10 to-black/10">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              Distribusi Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {platformData.length > 0 && totalClicks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={(entry) => `${entry.name} ${((entry.value / totalClicks) * 100).toFixed(0)}%`}
                      outerRadius={130}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {platformData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Belum ada data klik
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              Ringkasan Performa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-all duration-300">
                <div>
                  <p className="text-sm text-muted-foreground">Total Klik Shopee</p>
                  <p className="text-2xl font-bold text-orange-500">{platformData[0]?.value || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300">
                <div>
                  <p className="text-sm text-muted-foreground">Total Klik TikTok</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{platformData[1]?.value || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-black/20 dark:bg-white/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-black dark:text-white" />
                </div>
              </div>
              <div className="pt-4 text-center text-xs text-muted-foreground border-t">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
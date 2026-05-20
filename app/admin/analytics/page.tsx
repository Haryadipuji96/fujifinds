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
import { TrendingUp, ShoppingBag, MousePointerClick, Zap, Activity, RefreshCw, Crown, Target, Globe } from 'lucide-react'

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

const COLORS = ['#00D4FF', '#FF006E', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [topProducts, setTopProducts] = useState<ProductStat[]>([])
  const [platformData, setPlatformData] = useState<PlatformStat[]>([])
 type TrendData = {
  date: string
  clicks: number
}
const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const supabase = createClient()

    useEffect(() => {
    setMounted(true) // 🔥 TAMBAHKAN INI
  }, [])


  const fetchAnalytics = async (): Promise<void> => {
    setLoading(true)
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

    const shopeeCount = clicks.filter((c) => c.platform === 'Shopee').length
    const tiktokCount = clicks.filter((c) => c.platform === 'TikTok').length

    setPlatformData([
      { name: 'Shopee', value: shopeeCount },
      { name: 'TikTok', value: tiktokCount }
    ])


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


      useEffect(() => {
    fetchAnalytics()
  }, [])

  const totalClicks = platformData.reduce((sum, item) => sum + item.value, 0)
  const shopeePercentage = platformData[0] ? ((platformData[0].value / totalClicks) * 100).toFixed(1) : 0
  const tiktokPercentage = platformData[1] ? ((platformData[1].value / totalClicks) * 100).toFixed(1) : 0

  return (
    <div className="space-y-8">
      {/* Header with Refresh - Modern Glassmorphism */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/20">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#FF006E] to-[#00D4FF] bg-clip-text text-transparent animate-gradient">
                Analytics Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Real-time affiliate performance insights</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchAnalytics}
          className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-5 py-2.5 hover:border-[#00D4FF]/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/10 to-[#FF006E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-2">
            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500 text-slate-400 group-hover:text-[#00D4FF]" />
            <span className="text-sm text-slate-300 group-hover:text-white">Refresh Data</span>
          </div>
        </button>
      </div>

      {/* Stats Cards - Neon Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 group-hover:bg-[#00D4FF]/20 transition-colors">
                <ShoppingBag className="h-5 w-5 text-[#00D4FF]" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Total</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{totalClicks.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Clicks</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-[#00D4FF] to-[#FF006E] rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#FF006E]/10 group-hover:bg-[#FF006E]/20 transition-colors">
                <Zap className="h-5 w-5 text-[#FF006E]" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Share</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{shopeePercentage}%</div>
            <div className="text-sm text-slate-400">Shopee Share</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF006E] to-[#FF006E]/60 rounded-full transition-all duration-1000" style={{ width: `${shopeePercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Share</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{tiktokPercentage}%</div>
            <div className="text-sm text-slate-400">TikTok Share</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-400/60 rounded-full transition-all duration-1000" style={{ width: `${tiktokPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Crown className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Peak</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {Math.max(...trendData.map(d => d.clicks), 0)}
            </div>
            <div className="text-sm text-slate-400">Highest Daily Clicks</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-400/60 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart Card */}
        <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-xl bg-[#00D4FF]/10">
                <Activity className="h-4 w-4 text-[#00D4FF]" />
              </div>
              7-Day Click Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00D4FF" />
                        <stop offset="100%" stopColor="#FF006E" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#F1F5F9'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="url(#lineGradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#FF006E' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No click data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

       {/* Top Products Card - Horizontal Bar Chart */}
<Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF006E]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-white">
      <div className="p-1.5 rounded-xl bg-[#FF006E]/10">
        <TrendingUp className="h-4 w-4 text-[#FF006E]" />
      </div>
      Top Performing Products
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {topProducts.length > 0 ? (
        topProducts.map((product, idx) => (
          <div key={idx} className="group relative">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="text-slate-300 truncate max-w-[200px] md:max-w-[300px]" title={product.name}>
                {product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}
              </span>
              <span className="text-[#00D4FF] font-semibold">{product.clicks} clicks</span>
            </div>
            <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00D4FF] to-[#FF006E] rounded-lg transition-all duration-1000 flex items-center justify-end px-3"
                style={{ width: `${(product.clicks / topProducts[0].clicks) * 100}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {Math.round((product.clicks / topProducts[0].clicks) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-32 text-slate-500">
          No click data available
        </div>
      )}
    </div>
  </CardContent>
</Card>
      </div>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#FF006E]/20">
                <Globe className="h-4 w-4 text-[#00D4FF]" />
              </div>
              Platform Distribution
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
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No click data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-xl bg-[#00D4FF]/10">
                <Target className="h-4 w-4 text-[#00D4FF]" />
              </div>
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20 hover:border-[#00D4FF]/40 transition-all duration-300">
                <div>
                  <p className="text-sm text-slate-400">Total Shopee Clicks</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">{platformData[0]?.value || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-[#00D4FF]" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div>
                  <p className="text-sm text-slate-400">Total TikTok Clicks</p>
                  <p className="text-2xl font-bold text-purple-400">{platformData[1]?.value || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-800" suppressHydrationWarning>
  Last updated: {typeof window !== 'undefined' ? lastUpdated.toLocaleTimeString() : 'Loading...'}
</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
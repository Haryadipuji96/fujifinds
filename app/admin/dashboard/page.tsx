'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, DollarSign, Zap, BarChart3, Users, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, Gem, Rocket } from 'lucide-react'
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



  const fetchStats = async () => {
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    const { data: clicks } = await supabase
      .from('click_logs')
      .select('platform, clicked_at')

    const shopeeClicks = clicks?.filter(c => c.platform === 'Shopee').length || 0
    const tiktokClicks = clicks?.filter(c => c.platform === 'TikTok').length || 0

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
        .slice(-14)

      setChartData(data as any)
      setLastUpdated(new Date())
    }
  }

    useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF006E] shadow-lg shadow-[#00D4FF]/20 animate-pulse">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#FF006E] to-[#00D4FF] bg-clip-text text-transparent animate-gradient">
                Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Welcome to your affiliate command center</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-5 py-2.5 hover:border-[#00D4FF]/50 transition-all duration-300"
          disabled={loading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/10 to-[#FF006E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} text-slate-400 group-hover:text-[#00D4FF]`} />
            <span className="text-sm text-slate-300 group-hover:text-white">Refresh Data</span>
          </div>
        </button>
      </div>

      {/* Stats Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4FF]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#00D4FF]/10 group-hover:bg-[#00D4FF]/20 transition-colors">
                <Package className="h-5 w-5 text-[#00D4FF]" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Total</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" /> : stats.totalProducts}
            </div>
            <div className="text-sm text-slate-400">Total Products</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#00D4FF] to-[#00D4FF]/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF006E]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-[#FF006E]/10 group-hover:bg-[#FF006E]/20 transition-colors">
                <ShoppingCart className="h-5 w-5 text-[#FF006E]" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${Number(growth) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {Number(growth) >= 0 ? '+' : ''}{growth}%
                </span>
                {Number(growth) >= 0 ? <ArrowUpRight className="h-3 w-3 text-emerald-400" /> : <ArrowDownRight className="h-3 w-3 text-red-400" />}
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" /> : stats.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Clicks</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-[#FF006E] to-[#FF006E]/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10 cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Platform</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" /> : stats.shopeeClicks.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Shopee Clicks</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-400/60 rounded-full animate-pulse" style={{ width: `${stats.totalClicks ? (stats.shopeeClicks / stats.totalClicks * 100) : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 hover:border-[#00D4FF]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00D4FF]/10 cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Gem className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-500">Platform</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {loading ? <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" /> : stats.tiktokClicks.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">TikTok Clicks</div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-400/60 rounded-full animate-pulse" style={{ width: `${stats.totalClicks ? (stats.tiktokClicks / stats.totalClicks * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-[#00D4FF]/30 transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00D4FF]/5 to-[#FF006E]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-1.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#FF006E]/20">
              <Sparkles className="h-4 w-4 text-[#00D4FF]" />
            </div>
            14-Day Click Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF006E" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FF006E" stopOpacity={0} />
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
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#00D4FF" 
                    fill="url(#areaGradient)"
                    strokeWidth={2}
                  />
                  <Bar dataKey="Shopee" barSize={30} fill="#00D4FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="TikTok" barSize={30} fill="#FF006E" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                {loading ? 'Loading data...' : 'No click data available'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 to-transparent border border-[#00D4FF]/20 group hover:scale-105 transition-all duration-300 hover:border-[#00D4FF]/40">
          <div className="p-3 rounded-xl bg-[#00D4FF]/20">
            <TrendingUp className="h-6 w-6 text-[#00D4FF]" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Growth Rate</p>
            <p className="text-2xl font-bold text-[#00D4FF]">+{growth}%</p>
            <p className="text-xs text-slate-500">vs last month</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 group hover:scale-105 transition-all duration-300 hover:border-purple-500/40">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <Users className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Unique Visitors</p>
            <p className="text-2xl font-bold text-purple-400">-</p>
            <p className="text-xs text-slate-500">Coming soon</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 group hover:scale-105 transition-all duration-300 hover:border-emerald-500/40">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <Rocket className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-emerald-400">-</p>
            <p className="text-xs text-slate-500">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
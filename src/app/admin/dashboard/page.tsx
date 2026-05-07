'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Percent, 
  BarChart3, 
  Settings, 
  Search,
  LogOut,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStats {
  totalOrders: number;
  revenueToday: number;
  pendingPartners: number;
  lowStockCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err)
      }
    }
    fetchStats()
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'promotions', label: 'Promotions', icon: Percent },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const kpis = [
    { label: 'Orders Today', value: stats?.totalOrders ?? '...', trend: '+12%' },
    { label: 'Revenue Today', value: stats?.revenueToday?.toLocaleString() ?? '...', unit: 'ETB', trend: '+8%' },
    { label: 'Pending Partners', value: stats?.pendingPartners ?? '...', status: (stats?.pendingPartners ?? 0) > 0 ? 'warning' : 'success' },
    { label: 'Low Stock Alerts', value: stats?.lowStockCount ?? '...', status: (stats?.lowStockCount ?? 0) > 0 ? 'error' : 'success' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-surface-card border border-border-light p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-text-dark-muted uppercase font-bold tracking-widest">{kpi.label}</span>
                    {kpi.status === 'warning' && <AlertCircle size={14} className="text-warning" />}
                    {kpi.status === 'error' && <AlertCircle size={14} className="text-error" />}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    {kpi.unit && <span className="text-xs text-text-dark-muted font-mono">{kpi.unit}</span>}
                    <span className="text-2xl font-mono font-bold text-text-dark">{kpi.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-card border border-border-light p-12 text-center">
              <BarChart3 size={48} className="mx-auto text-text-dark-muted opacity-20 mb-4" />
              <p className="text-text-dark-muted text-xs uppercase tracking-widest font-bold">Analytics Engine Active</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-surface-card border border-border-light p-20 text-center">
            <p className="text-text-dark-muted uppercase tracking-widest text-xs font-bold">Module Loading...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-surface flex selection:bg-accent/30">
      {/* Sidebar */}
      <aside className="w-64 bg-ink flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-8">
          <Link href="/" className="font-display font-semibold text-xl tracking-[0.3em] text-text-primary uppercase">
            Kalsuq
          </Link>
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-sm transition-all",
                activeTab === item.id 
                  ? "bg-ink-card text-accent border-r-2 border-accent" 
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} />
                <span className="tracking-wide">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border-dark">
          <button 
            onClick={() => {
              document.cookie = "kalsuq-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              router.push('/admin/login');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-text-muted hover:text-error transition-colors"
          >
            <LogOut size={18} />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="h-16 bg-surface border-b border-border-light sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center bg-surface-card border border-border-light px-4 py-1.5 w-96">
            <Search size={16} className="text-text-dark-muted mr-3" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none text-sm text-text-dark focus:ring-0 w-full placeholder:text-text-dark-muted"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-xs font-bold text-text-dark">Abebe Admin</p>
              <p className="text-[9px] text-text-dark-muted uppercase font-bold tracking-widest">Super Admin</p>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/admin/ImageUpload'
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
  AlertCircle,
  Menu,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [activeTab])

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-surface-card border border-border-primary p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{kpi.label}</span>
                    {kpi.status === 'warning' && <AlertCircle size={14} className="text-warning" />}
                    {kpi.status === 'error' && <AlertCircle size={14} className="text-error" />}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    {kpi.unit && <span className="text-xs text-text-muted font-mono">{kpi.unit}</span>}
                    <span className="text-xl md:text-2xl font-mono font-bold text-text-primary">{kpi.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-card border border-border-primary p-8 md:p-12 text-center overflow-x-auto">
              <BarChart3 size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
              <p className="text-text-muted text-xs uppercase tracking-widest font-bold">Analytics Engine Active</p>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">Manage Products</h2>
              <button className="bg-accent text-white px-4 py-2 font-bold text-sm tracking-widest uppercase">Add New Product</button>
            </div>
            
            <div className="bg-surface-card border border-border-primary p-6 space-y-6">
              <h3 className="font-bold text-lg border-b border-border-primary pb-4">Product Media</h3>
              <p className="text-text-muted text-sm">Upload high-quality images for your products. Images are automatically optimized and served globally via Cloudinary.</p>
              
              <ImageUpload 
                value={[]} 
                onChange={() => alert('Image uploaded! Logic can be hooked to state.')} 
                onRemove={() => {}} 
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-surface-card border border-border-primary p-12 md:p-20 text-center">
            <p className="text-text-muted uppercase tracking-widest text-xs font-bold">Module Loading...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-surface flex selection:bg-accent/30 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-ink flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 md:p-8 flex justify-between items-center">
          <div>
            <Link href="/" className="font-display font-semibold text-xl tracking-[0.3em] text-text-primary uppercase">
              Kalsuq
            </Link>
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2">Admin Console</p>
          </div>
          <button 
            className="md:hidden text-text-muted hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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

        <div className="p-4 border-t border-border-primary mt-auto">
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
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300 w-full">
        <header className="h-16 bg-surface border-b border-border-primary sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="md:hidden text-text-primary hover:text-accent transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center bg-surface-card border border-border-primary px-4 py-1.5 max-w-sm w-full">
              <Search size={16} className="text-text-muted mr-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm text-text-primary focus:ring-0 w-full placeholder:text-text-muted"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-text-primary">Abebe Admin</p>
              <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Super Admin</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

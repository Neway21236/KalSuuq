'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/admin/ImageUpload'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 8900 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

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
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-surface-card border border-border-primary p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{kpi.label}</span>
                    {kpi.status === 'warning' && (kpi.value as number) > 0 && <span className="bg-warning text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{kpi.value}</span>}
                    {kpi.status === 'error' && (kpi.value as number) > 0 && <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{kpi.value}</span>}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    {kpi.unit && <span className="text-xs text-text-muted font-mono">{kpi.unit}</span>}
                    <span className="text-xl md:text-2xl font-mono font-bold text-text-primary">{kpi.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Alert */}
            {(stats?.pendingPartners ?? 0) > 0 && (
              <div className="bg-accent/10 border border-accent/30 text-text-primary text-sm p-4 rounded-none flex items-center justify-between">
                <span>{stats?.pendingPartners} new partner applications awaiting review</span>
                <span className="font-bold">→</span>
              </div>
            )}

            {/* Revenue chart */}
            <div className="bg-surface-card border border-border-primary p-6 mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-lg">Revenue Overview</h3>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d'].map(period => (
                    <button key={period} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-border-primary hover:border-accent hover:text-accent rounded-full transition-colors">
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} dx={-10} tickFormatter={(val) => `ETB ${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-primary)', borderRadius: '0px' }}
                      itemStyle={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4, fill: 'var(--surface-card)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--accent)', stroke: 'var(--surface)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 Products + Recent Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-surface-card border border-border-primary p-6">
                <h3 className="font-display font-bold text-lg mb-4">Top 5 Products</h3>
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-surface border border-border-primary"></div>
                        <div>
                          <p className="text-sm font-bold">Product Name {i}</p>
                          <p className="text-[10px] text-text-muted uppercase">Category</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold">12{i} sold</p>
                        <p className="text-[10px] text-text-muted">ETB {(1200 * i).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-card border border-border-primary p-6">
                <h3 className="font-display font-bold text-lg mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
                      <div>
                        <p className="text-sm font-bold">Order #KAL-{1000+i}</p>
                        <p className="text-[10px] text-text-muted">Abebe Kebede • 2 items</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-sm font-mono font-bold">ETB {(4500 * i).toLocaleString()}</p>
                        <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">Manage Products</h2>
              <button className="bg-accent text-white px-4 py-2 font-bold text-sm tracking-widest uppercase shadow-md hover:bg-accent-hover transition-colors">Add New Product</button>
            </div>
            
            <div className="flex items-center space-x-4">
              <input type="text" placeholder="Search products..." className="border border-border-primary p-2 text-sm w-64 bg-surface" />
              <button className="border border-border-primary px-4 py-2 text-sm bg-surface">Filters</button>
              <button className="border border-border-primary px-4 py-2 text-sm bg-surface">Bulk Actions</button>
            </div>

            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  <tr>
                    <td className="p-4"><div className="w-10 h-10 bg-surface border border-border-primary" /></td>
                    <td className="p-4 font-bold text-text-primary">City Leather Boots</td>
                    <td className="p-4">Shoes</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">Published</span></td>
                    <td className="p-4 font-mono">124</td>
                    <td className="p-4 font-mono">ETB 5,400</td>
                    <td className="p-4 text-accent hover:underline cursor-pointer">Edit</td>
                  </tr>
                  <tr>
                    <td className="p-4"><div className="w-10 h-10 bg-surface border border-border-primary" /></td>
                    <td className="p-4 font-bold text-text-primary">Heritage Tote</td>
                    <td className="p-4">Accessories</td>
                    <td className="p-4"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">Draft</span></td>
                    <td className="p-4 font-mono">0</td>
                    <td className="p-4 font-mono">ETB 4,500</td>
                    <td className="p-4 text-accent hover:underline cursor-pointer">Edit</td>
                  </tr>
                  <tr>
                    <td className="p-4"><div className="w-10 h-10 bg-surface border border-border-primary" /></td>
                    <td className="p-4 font-bold text-text-primary">Linen Shirt</td>
                    <td className="p-4">Clothes</td>
                    <td className="p-4"><span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">Archived</span></td>
                    <td className="p-4 font-mono">0</td>
                    <td className="p-4 font-mono">ETB 3,200</td>
                    <td className="p-4 text-accent hover:underline cursor-pointer">Edit</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-surface-card border border-border-primary p-6 space-y-6">
              <h3 className="font-bold text-lg border-b border-border-primary pb-4">Product Editor (Spec Loader)</h3>
              <ul className="list-disc list-inside space-y-2 text-text-muted text-sm">
                <li>EN + አማ fields for name, short description, long description</li>
                <li>Image upload (Cloudinary) + drag-to-reorder + primary selection</li>
                <li>Variant matrix (size × colour grid with stock inputs)</li>
                <li>Status, Featured toggle, Best Seller toggle</li>
                <li>Scheduled publish date/time picker</li>
                <li>SEO fields (meta title, meta description, slug)</li>
                <li>Complete The Look multi-select & Bundle configuration</li>
              </ul>
              <div className="pt-4">
                <ImageUpload value={[]} onChange={() => {}} onRemove={() => {}} />
              </div>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Orders</h2>
            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  <tr className="border border-amber-400 bg-amber-50/10">
                    <td className="p-4 font-bold">#KAL-1005</td>
                    <td className="p-4">Abebe Kebede</td>
                    <td className="p-4"><span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">Pending Confirmation</span></td>
                    <td className="p-4 font-mono">ETB 12,000</td>
                    <td className="p-4 text-text-muted">Today, 10:30 AM</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">#KAL-1004</td>
                    <td className="p-4">Hanna Tadesse</td>
                    <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">Payment Confirmed</span></td>
                    <td className="p-4 font-mono">ETB 4,500</td>
                    <td className="p-4 text-text-muted">Today, 09:15 AM</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">#KAL-1003</td>
                    <td className="p-4">Dawit Mengistu</td>
                    <td className="p-4"><span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-bold">Processing</span></td>
                    <td className="p-4 font-mono">ETB 7,800</td>
                    <td className="p-4 text-text-muted">Yesterday</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">#KAL-1002</td>
                    <td className="p-4">Helen Getachew</td>
                    <td className="p-4"><span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold">Dispatched</span></td>
                    <td className="p-4 font-mono">ETB 5,400</td>
                    <td className="p-4 text-text-muted">Yesterday</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">#KAL-1001</td>
                    <td className="p-4">Samuel Bekele</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">Delivered</span></td>
                    <td className="p-4 font-mono">ETB 3,200</td>
                    <td className="p-4 text-text-muted">2 Days Ago</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">#KAL-1000</td>
                    <td className="p-4">Betelhem Assefa</td>
                    <td className="p-4"><span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">Refunded</span></td>
                    <td className="p-4 font-mono">ETB 2,100</td>
                    <td className="p-4 text-text-muted">Last Week</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'partners':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Partners</h2>
            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Partner</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total Sales</th>
                    <th className="p-4">Pending Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  <tr>
                    <td className="p-4 font-bold">Alemu Design</td>
                    <td className="p-4">Artisan</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">Active</span></td>
                    <td className="p-4 font-mono">ETB 45,000</td>
                    <td className="p-4 font-mono">ETB 12,000</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Selam Threads</td>
                    <td className="p-4">Boutique</td>
                    <td className="p-4"><span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">Pending</span></td>
                    <td className="p-4 font-mono">-</td>
                    <td className="p-4 font-mono">-</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Ethio Crafts</td>
                    <td className="p-4">Manufacturer</td>
                    <td className="p-4"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">Inactive</span></td>
                    <td className="p-4 font-mono">ETB 120,000</td>
                    <td className="p-4 font-mono">ETB 0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'promotions':
        return (
          <div className="bg-surface-card border border-border-primary p-12 text-center">
            <Percent size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Promotions Engine</h2>
            <p className="text-text-muted max-w-md mx-auto">Manage discount codes, bundle deals, and the global announcement bar.</p>
          </div>
        )
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Analytics Reports</h2>
              <button className="border border-border-primary px-4 py-2 text-[10px] uppercase tracking-widest font-bold">Export CSV</button>
            </div>
            <div className="bg-surface-card border border-border-primary p-6 text-center">
              <BarChart3 size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
              <p className="text-text-muted max-w-md mx-auto">Advanced Recharts integration for Secondary Metrics (Taupe #BDA792) and Primary (Accent #D89F69) goes here.</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="bg-surface-card border border-border-primary p-12 text-center">
            <Settings size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">Super Admin Settings</h2>
            <p className="text-text-muted max-w-md mx-auto">Configure global platform variables, tax rates, shipping zones, and admin roles.</p>
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

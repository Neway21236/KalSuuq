'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  DollarSign,
  Copy,
  MessageCircle,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/partner/stats')
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch partner stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mylink', label: 'My Link', icon: LinkIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'assets', label: 'Assets', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const statItems = [
    { label: 'Clicks', value: stats?.clicks ?? '...', icon: TrendingUp },
    { label: 'Orders', value: stats?.orders ?? '...', icon: ShoppingBag },
    { label: 'Pending Commission', value: stats?.pendingCommission.toLocaleString() ?? '...', icon: DollarSign, unit: 'ETB' },
    { label: 'Confirmed Commission', value: stats?.confirmedCommission.toLocaleString() ?? '...', icon: DollarSign, unit: 'ETB' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statItems.map((stat, i) => (
                <div key={i} className="bg-[#1A1614] border border-border-dark p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-[0.2em]">{stat.label}</span>
                    <stat.icon size={16} className="text-accent/40" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    {stat.unit && <span className="text-xs text-text-muted font-mono">{stat.unit}</span>}
                    <span className="text-2xl font-mono font-bold text-text-primary">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: My Link & Share */}
              <div className="lg:col-span-5 space-y-8">
                <section className="bg-[#1A1614] border border-border-dark p-8 space-y-6 shadow-xl">
                  <h3 className="font-display text-xl text-text-primary">Your Partner Link</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] text-text-muted uppercase font-bold tracking-widest block mb-2">Referral Code</label>
                      <div className="bg-[#0D0B0A] border border-border-dark p-4 flex items-center justify-between">
                        <span className="font-mono text-xl text-accent font-bold">{stats?.referralCode || '...'}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(stats?.referralCode)
                            toast('Code copied', 'success')
                          }}
                          className="text-text-muted hover:text-accent transition-colors"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Recent Activity */}
              <div className="lg:col-span-7">
                <section className="bg-[#1A1614] border border-border-dark overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-border-dark flex justify-between items-center">
                    <h3 className="font-display text-xl text-text-primary">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-[10px] text-accent font-bold uppercase tracking-widest hover:underline">View All →</button>
                  </div>
                  <div className="p-12 text-center text-text-muted italic text-xs tracking-widest uppercase">
                    Syncing live referrals...
                  </div>
                </section>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-[#1A1614] border border-border-dark p-20 text-center shadow-xl">
            <p className="text-text-muted uppercase tracking-widest text-xs font-bold">Module Loading...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0B0A] flex selection:bg-accent/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D0B0A] border-r border-border-dark flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-8">
          <Link href="/" className="font-display font-semibold text-xl tracking-[0.3em] text-text-primary uppercase">
            Kalsuq
          </Link>
          <p className="text-[9px] text-accent font-bold uppercase tracking-[0.2em] mt-2">Partner Portal</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all",
                activeTab === item.id 
                  ? "bg-[#1A1614] text-accent border-r-2 border-accent" 
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <item.icon size={18} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border-dark">
          <button 
            onClick={() => {
              document.cookie = "kalsuq-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              router.push('/portal/login');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-text-muted hover:text-error transition-colors"
          >
            <LogOut size={18} />
            <span className="tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <header className="flex justify-between items-end mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="font-display text-4xl text-text-primary">Welcome, Partner</h1>
            <p className="text-sm text-text-muted mt-2 tracking-wide font-body">Here&apos;s your performance overview.</p>
          </div>
          <div className="bg-[#1A1614] border border-border-dark px-6 py-3 flex items-center space-x-4 shadow-xl">
            <div className="text-right">
              <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Next Payout</p>
              <p className="text-sm font-mono font-bold text-text-primary">{stats?.nextPayout || '...'}</p>
            </div>
            <div className="h-8 w-px bg-border-dark" />
            <button className="bg-accent text-ink px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-all">
              Request Payout
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}

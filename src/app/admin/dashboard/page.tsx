'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
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
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { Product, ProductVariant, Order, PartnerApplication } from '@prisma/client'

type ProductWithVariants = Product & {
  variants: ProductVariant[]
}

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
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [partners, setPartners] = useState<PartnerApplication[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    sku: '',
    category: '', 
    collection: '',
    price: '', 
    originalPrice: '',
    stockQuantity: '', 
    lowStockThreshold: '3',
    shortDescription: '',
    description: '', 
    image: '', 
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    isFeatured: false,
    isBestSeller: false,
    tags: [] as string[],
    variants: [] as { sku: string; size: string; colour: string; stock: string; price: string }[]
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard') {
          const res = await fetch('/api/admin/stats');
          const data = await res.json();
          if (data.success) setStats(data.stats);
        } else if (activeTab === 'products' && products.length === 0) {
          const res = await fetch('/api/admin/products');
          const data = await res.json();
          if (data.success) setProducts(data.products);
        } else if (activeTab === 'orders' && orders.length === 0) {
          const res = await fetch('/api/admin/orders');
          const data = await res.json();
          if (data.success) setOrders(data.orders);
        } else if (activeTab === 'partners' && partners.length === 0) {
          const res = await fetch('/api/admin/partners');
          const data = await res.json();
          if (data.success) setPartners(data.partners);
        }
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleAddProduct = async () => {
    if (!newProduct.image) {
      alert("Please upload an image first");
      return;
    }
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        setProducts([data.product, ...products]);
        setIsAddingProduct(false);
        setNewProduct({ 
          name: '', 
          sku: '',
          category: '', 
          collection: '',
          price: '', 
          originalPrice: '',
          stockQuantity: '', 
          lowStockThreshold: '3',
          shortDescription: '',
          description: '', 
          image: '', 
          status: 'DRAFT',
          isFeatured: false,
          isBestSeller: false,
          tags: [],
          variants: []
        });
        alert("Product added successfully!");
      } else {
        alert("Failed to add product: " + data.error);
      }
    } catch {
      alert("Error adding product");
    }
  };

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [activeTab])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: BarChart3 },
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
                        <p className="text-sm font-bold">Order {orders[i]?.orderNumber || `#KAL-${1000+i}`}</p>
                        <p className="text-[10px] text-text-muted">{orders[i]?.customerName || 'Abebe Kebede'} • 2 items</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-sm font-mono font-bold">ETB {(orders[i]?.total || 4500 * i).toLocaleString()}</p>
                        <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">{orders[i]?.orderStatus || 'Pending'}</span>
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
              <button onClick={() => setIsAddingProduct(!isAddingProduct)} className="bg-accent text-white px-4 py-2 font-bold text-sm tracking-widest uppercase shadow-md hover:bg-accent-hover transition-colors">
                {isAddingProduct ? 'Cancel' : 'Add New Product'}
              </button>
            </div>
            
            {isAddingProduct && (
              <div className="bg-surface-card border border-border-primary p-6 space-y-4 mb-6">
                <h3 className="font-bold text-lg border-b border-border-primary pb-4">Create Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Product Name</label>
                    <input type="text" placeholder="e.g. Vintage Leather Jacket" required value={newProduct.name} onChange={e => setNewProduct(prev => ({...prev, name: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">SKU</label>
                    <input type="text" placeholder="KS-VNTG-LJ" value={newProduct.sku} onChange={e => setNewProduct(prev => ({...prev, sku: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Category</label>
                    <input type="text" placeholder="e.g. Outerwear" required value={newProduct.category} onChange={e => setNewProduct(prev => ({...prev, category: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Collection</label>
                    <input type="text" placeholder="e.g. Winter 2026" required value={newProduct.collection} onChange={e => setNewProduct(prev => ({...prev, collection: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Status</label>
                    <select value={newProduct.status} onChange={e => setNewProduct(prev => ({...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'}))} className="w-full border border-border-primary p-2 text-sm bg-surface">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Sale Price (ETB)</label>
                    <input type="number" placeholder="0.00" required value={newProduct.price} onChange={e => setNewProduct(prev => ({...prev, price: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Base Price (ETB)</label>
                    <input type="number" placeholder="Optional" value={newProduct.originalPrice} onChange={e => setNewProduct(prev => ({...prev, originalPrice: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Stock Quantity</label>
                    <input type="number" value={newProduct.stockQuantity} onChange={e => setNewProduct(prev => ({...prev, stockQuantity: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface font-mono" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Short Description</label>
                    <input type="text" placeholder="One sentence summary" value={newProduct.shortDescription} onChange={e => setNewProduct(prev => ({...prev, shortDescription: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Long Description</label>
                    <textarea placeholder="Detailed product specifications..." required value={newProduct.description} onChange={e => setNewProduct(prev => ({...prev, description: e.target.value}))} className="w-full border border-border-primary p-2 text-sm bg-surface" rows={4} />
                  </div>

                  <div className="flex items-center space-x-6 md:col-span-3 py-2 border-y border-border-primary/50">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={newProduct.isFeatured} onChange={e => setNewProduct(prev => ({...prev, isFeatured: e.target.checked}))} className="rounded-none border-border-primary text-accent focus:ring-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Featured Product</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={newProduct.isBestSeller} onChange={e => setNewProduct(prev => ({...prev, isBestSeller: e.target.checked}))} className="rounded-none border-border-primary text-accent focus:ring-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Best Seller</span>
                    </label>
                  </div>
                </div>

                {/* Variant Manager */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Variants (Size/Colour)</h4>
                    <button 
                      type="button"
                      onClick={() => setNewProduct(prev => ({
                        ...prev, 
                        variants: [...prev.variants, { sku: '', size: '', colour: '', stock: '0', price: '' }]
                      }))}
                      className="text-[10px] font-bold uppercase border border-border-primary px-2 py-1 hover:bg-surface-card"
                    >
                      + Add Variant
                    </button>
                  </div>
                  {newProduct.variants.length > 0 && (
                    <div className="space-y-2">
                      {newProduct.variants.map((variant, idx) => (
                        <div key={idx} className="grid grid-cols-5 gap-2 items-end bg-surface p-2 border border-border-primary border-dashed">
                          <input type="text" placeholder="Size" value={variant.size} onChange={e => {
                            const v = [...newProduct.variants];
                            v[idx].size = e.target.value;
                            setNewProduct(prev => ({...prev, variants: v}));
                          }} className="text-[10px] p-1 bg-transparent border border-border-primary" />
                          <input type="text" placeholder="Colour" value={variant.colour} onChange={e => {
                            const v = [...newProduct.variants];
                            v[idx].colour = e.target.value;
                            setNewProduct(prev => ({...prev, variants: v}));
                          }} className="text-[10px] p-1 bg-transparent border border-border-primary" />
                          <input type="number" placeholder="Stock" value={variant.stock} onChange={e => {
                            const v = [...newProduct.variants];
                            v[idx].stock = e.target.value;
                            setNewProduct(prev => ({...prev, variants: v}));
                          }} className="text-[10px] p-1 bg-transparent border border-border-primary font-mono" />
                          <input type="number" placeholder="Price" value={variant.price} onChange={e => {
                            const v = [...newProduct.variants];
                            v[idx].price = e.target.value;
                            setNewProduct(prev => ({...prev, variants: v}));
                          }} className="text-[10px] p-1 bg-transparent border border-border-primary font-mono" />
                          <button 
                            type="button"
                            onClick={() => {
                              const v = newProduct.variants.filter((_, i) => i !== idx);
                              setNewProduct(prev => ({...prev, variants: v}));
                            }}
                            className="text-[10px] text-error font-bold uppercase text-center"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Product Image</label>
                  <ImageUpload 
                    value={newProduct.image ? [newProduct.image] : []} 
                    onChange={(url) => setNewProduct(prev => ({...prev, image: url}))} 
                    onRemove={() => setNewProduct(prev => ({...prev, image: ''}))} 
                  />
                </div>
                <button onClick={handleAddProduct} className="bg-success text-white px-6 py-2 font-bold text-sm tracking-widest uppercase mt-4">Save Product</button>
              </div>
            )}

            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">SKU / Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="p-4">
                        {p.image && (
                          <div className="w-12 h-12 relative border border-border-primary overflow-hidden bg-surface-card">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-[9px] text-text-muted font-mono uppercase tracking-tighter mb-1">{p.sku || 'No SKU'}</p>
                        <p className="font-bold text-text-primary text-sm">{p.name}</p>
                      </td>
                      <td className="p-4 text-xs">{p.category}</td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                          p.status === 'PUBLISHED' ? "bg-success/10 text-success" : 
                          p.status === 'DRAFT' ? "bg-text-muted/10 text-text-muted" : "bg-error/10 text-error"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className={cn(
                          "font-mono font-bold text-sm",
                          p.stockQuantity <= (p.lowStockThreshold || 3) ? "text-error" : "text-text-primary"
                        )}>
                          {p.stockQuantity}
                        </p>
                        <p className="text-[8px] text-text-muted uppercase">Units</p>
                      </td>
                      <td className="p-4">
                        <p className="font-mono font-bold">ETB {p.price.toLocaleString()}</p>
                        {p.originalPrice && <p className="text-[9px] text-text-muted line-through">ETB {p.originalPrice.toLocaleString()}</p>}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-text-muted">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold">Inventory Report</h2>
              <div className="flex space-x-2">
                <button className="border border-border-primary px-4 py-2 text-[10px] uppercase tracking-widest font-bold bg-surface-card">Filter: Low Stock</button>
                <button className="bg-ink text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">Download Report</button>
              </div>
            </div>
            
            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Product / Variant</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4 text-center">Current Stock</th>
                    <th className="p-4 text-center">Threshold</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {products.map(p => (
                    <React.Fragment key={p.id}>
                      <tr className="bg-surface/30">
                        <td className="p-4">
                          <p className="font-bold">{p.name}</p>
                          <p className="text-[10px] text-text-muted uppercase">{p.category}</p>
                        </td>
                        <td className="p-4 font-mono text-xs">{p.sku || 'N/A'}</td>
                        <td className="p-4 text-center font-mono font-bold">{p.stockQuantity}</td>
                        <td className="p-4 text-center font-mono text-text-muted">{p.lowStockThreshold || 3}</td>
                        <td className="p-4">
                          {p.stockQuantity <= (p.lowStockThreshold || 3) ? 
                            <span className="text-error text-[10px] font-bold uppercase tracking-widest">Reorder Now</span> : 
                            <span className="text-success text-[10px] font-bold uppercase tracking-widest">Healthy</span>
                          }
                        </td>
                        <td className="p-4">
                          <button className="text-accent text-[10px] font-bold uppercase hover:underline">Adjust</button>
                        </td>
                      </tr>
                      {p.variants?.map((v) => (
                        <tr key={v.id} className="text-[11px] border-l-2 border-accent/20">
                          <td className="p-4 pl-8 text-text-muted italic">
                            — Variant: {v.size} {v.colour}
                          </td>
                          <td className="p-4 font-mono">{v.sku || 'N/A'}</td>
                          <td className="p-4 text-center font-mono">{v.stock}</td>
                          <td className="p-4 text-center text-text-muted font-mono">—</td>
                          <td className="p-4">
                            {v.stock <= 2 ? <span className="text-warning">Low</span> : <span>OK</span>}
                          </td>
                          <td className="p-4">
                            <button className="text-accent/70 hover:underline">Adjust</button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
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
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-bold">{o.orderNumber}</td>
                      <td className="p-4">{o.customerName}</td>
                      <td className="p-4"><span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">{o.orderStatus}</span></td>
                      <td className="p-4 font-mono">ETB {o.total.toLocaleString()}</td>
                      <td className="p-4 text-text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-text-muted">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'partners':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold">Partner Applications</h2>
            <div className="bg-surface-card border border-border-primary overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border-primary text-text-muted">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Platform</th>
                    <th className="p-4">Audience</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {partners.map(p => (
                    <tr key={p.id}>
                      <td className="p-4 font-bold">{p.fullName}</td>
                      <td className="p-4">{p.platform}</td>
                      <td className="p-4">{p.audienceSize}</td>
                      <td className="p-4"><span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">{p.status}</span></td>
                      <td className="p-4 text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-text-muted">No applications found.</td></tr>
                  )}
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

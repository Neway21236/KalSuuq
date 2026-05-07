'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (data.success) {
        toast('Welcome back, Admin', 'success')
        router.push('/admin/dashboard')
      } else {
        toast(data.message || 'Invalid credentials', 'error')
      }
    } catch (err) {
      toast('Failed to connect to server', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-8">
          <Link href="/" className="font-display font-semibold text-4xl tracking-[0.6em] text-[#120C0A] uppercase block">
            Kalsuq
          </Link>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-[#D89F69]">
              <ShieldAlert size={24} />
              <h1 className="font-display text-4xl text-[#120C0A] tracking-tight font-bold">Admin Console</h1>
            </div>
            <p className="text-[10px] text-[#4A403A] uppercase tracking-[0.4em] font-bold opacity-70">Authorised Personnel Only</p>
          </div>
        </div>

        <div className="bg-white border border-[#EBE3D5] p-10 md:p-14 shadow-2xl">
          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#120C0A] uppercase tracking-[0.3em]">Administrator Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kalsuq.com" 
                className="w-full bg-[#FDFCFB] border border-[#EBE3D5] text-[#120C0A] rounded-none px-5 py-4 focus:border-[#D89F69] focus:ring-0 outline-none text-base" 
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#120C0A] uppercase tracking-[0.3em]">Access Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#FDFCFB] border border-[#EBE3D5] text-[#120C0A] rounded-none px-5 py-4 focus:border-[#D89F69] focus:ring-0 outline-none text-base" 
                required 
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-[#D89F69] text-white py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-xl active:scale-95 mt-4 disabled:opacity-50",
                !isLoading && "hover:bg-[#C58E58]"
              )}
            >
              {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <div className="space-y-4 text-center">
          <Link href="/" className="text-[10px] font-bold text-[#D89F69] uppercase tracking-[0.3em] hover:underline">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}

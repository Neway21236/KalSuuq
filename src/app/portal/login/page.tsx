'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export default function PortalLoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/portal/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (data.success) {
        toast(`OTP sent to +251 ${phone}`, 'success')
        setStep('otp')
      } else {
        toast(data.message, 'error')
      }
    } catch {
      toast('Connection error', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const code = otp.join('')
    try {
      const res = await fetch('/api/auth/portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      })
      const data = await res.json()
      if (data.success) {
        toast('Verification successful', 'success')
        router.push('/portal/dashboard')
      } else {
        toast(data.message, 'error')
      }
    } catch {
      toast('Verification failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0B0A] flex flex-col items-center justify-center p-4 selection:bg-accent/30 transition-colors duration-500">
      <Link 
        href="/partners" 
        className="absolute top-8 left-8 text-text-muted hover:text-accent flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] transition-all"
      >
        <ChevronLeft size={14} />
        <span>Back to Partners</span>
      </Link>

      <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-8">
          <Link href="/" className="font-display font-semibold text-4xl tracking-[0.6em] text-text-primary uppercase block transition-transform hover:scale-105">
            Kalsuq
          </Link>
          <div className="space-y-4">
            <h1 className="font-display text-4xl text-text-primary tracking-tight font-bold">Partner Login</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] font-bold opacity-70">
              {step === 'phone' ? 'Enter phone to receive OTP' : 'Check your messages'}
            </p>
          </div>
        </div>

        <div className="bg-[#1A1614] border border-border-dark p-10 md:p-12 shadow-2xl">
          {step === 'phone' ? (
            <form className="space-y-8" onSubmit={handleSendOTP}>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-mono font-bold">+251</span>
                  <input 
                    type="tel" 
                    placeholder="911 000 000" 
                    className="w-full bg-[#0D0B0A] border border-border-dark text-text-primary rounded-none px-5 py-5 pl-16 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-300 text-base font-mono" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full bg-accent text-ink py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-xl active:scale-95 disabled:opacity-50",
                  !isLoading && "hover:bg-accent-hover"
                )}
              >
                {isLoading ? 'Sending...' : 'Send OTP →'}
              </button>
            </form>
          ) : (
            <form className="space-y-10" onSubmit={handleVerify}>
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] text-center block">Enter 6-digit Code</label>
                <div className="flex justify-between gap-3">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      id={`otp-${i}`}
                      type="text" 
                      inputMode="numeric"
                      maxLength={1}
                      className="w-full h-14 bg-[#0D0B0A] border border-border-dark text-center text-xl font-mono font-bold text-accent focus:border-accent focus:outline-none transition-all duration-300"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-accent text-ink py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-xl active:scale-95 disabled:opacity-50",
                    !isLoading && "hover:bg-accent-hover"
                  )}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-[9px] text-text-muted uppercase tracking-[0.4em] font-bold hover:text-accent transition-colors"
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-[9px] text-text-muted text-center uppercase tracking-[0.5em] font-bold opacity-40">
          Kalsuq Partner Network · Secure Access
        </p>
      </div>
    </div>
  )
}

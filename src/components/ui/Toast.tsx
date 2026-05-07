'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col space-y-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center space-x-4 px-6 py-4 bg-surface-card border shadow-2xl min-w-[320px] max-w-md",
                t.type === 'success' && "border-accent/40",
                t.type === 'error' && "border-error/40",
                t.type === 'info' && "border-border-primary"
              )}
            >
              <div className={cn(
                "p-2 rounded-none",
                t.type === 'success' && "bg-accent/10 text-accent",
                t.type === 'error' && "bg-error/10 text-error",
                t.type === 'info' && "bg-accent/5 text-accent"
              )}>
                {t.type === 'success' && <CheckCircle size={20} />}
                {t.type === 'error' && <AlertCircle size={20} />}
                {t.type === 'info' && <Info size={20} />}
              </div>
              <p className="flex-1 text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary leading-relaxed">
                {t.message}
              </p>
              <button 
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                className="text-text-muted hover:text-text-primary transition-colors p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

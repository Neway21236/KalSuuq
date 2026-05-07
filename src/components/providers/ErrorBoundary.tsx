'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-error/10 text-error flex items-center justify-center mx-auto border border-error/20">
              <AlertTriangle size={40} />
            </div>
            <h1 className="font-display text-4xl text-text-primary tracking-tight font-bold">Something went wrong.</h1>
            <p className="text-text-secondary leading-relaxed">
              We encountered an unexpected error. Our team has been notified. Please try refreshing the page or return home.
            </p>
            <div className="pt-6">
              <button 
                onClick={() => window.location.reload()}
                className="bg-accent text-white dark:text-ink px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
              >
                Refresh Page
              </button>
            </div>
            <div className="pt-2">
              <Link href="/" className="text-text-muted hover:text-accent text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                Return to Storefront
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

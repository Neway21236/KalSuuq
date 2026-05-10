'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import Image from 'next/image'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

// FR-SRCH-01 to 04
export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Debounced search (FR-SRCH-02)
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.success) setResults(data.products || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] bg-surface dark:bg-[#0D0B0A] flex flex-col"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-border-primary pb-4">
              <div className="flex-1 flex items-center space-x-4">
                <Search className="text-text-muted" size={24} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products, categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xl md:text-3xl font-display text-text-primary placeholder:text-text-muted"
                />
              </div>
              <button onClick={onClose} className="p-2 text-text-primary hover:text-accent transition-all">
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center text-text-muted text-sm uppercase tracking-widest font-bold mt-12">Searching...</div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {results.map((p) => (
                    <Link key={p.id} href={`/shop/${p.slug}`} onClick={onClose} className="group">
                      <div className="aspect-[4/5] bg-surface-card overflow-hidden mb-4 relative">
                        <Image src={p.images?.[0] || '/placeholder.png'} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <h4 className="font-bold text-sm tracking-wide">{p.name}</h4>
                      <p className="text-accent text-xs font-mono mt-1">{p.price} ETB</p>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center mt-20">
                  <h3 className="text-2xl font-display text-text-primary mb-4">No results for &quot;{query}&quot;</h3>
                  <p className="text-text-muted mb-8 text-sm">Try checking your spelling or exploring our best sellers.</p>
                  <Link href="/shop" onClick={onClose} className="inline-block bg-accent text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="text-text-muted text-sm mt-12">
                  <h4 className="uppercase font-bold tracking-widest text-[10px] mb-4">Popular Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Shoes', 'Leather', 'Bundles', 'Jacket'].map((term) => (
                      <button key={term} onClick={() => setQuery(term)} className="px-4 py-2 border border-border-primary hover:border-accent text-xs transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

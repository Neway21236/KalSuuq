import { useState, useEffect } from 'react'

/**
 * Risk #4 Fix: Zustand Hydration Mismatch Prevention
 * 
 * When using Zustand with localStorage persistence, the server renders with
 * empty state (no localStorage access), but the client immediately hydrates
 * with the stored data. This mismatch causes React hydration errors.
 * 
 * Usage:
 *   const hydrated = useHasHydrated()
 *   if (!hydrated) return <Skeleton />
 *   return <CartItems items={items} />
 */
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

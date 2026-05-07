'use client'

import { usePathname } from 'next/navigation'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import AIChatWidget from './AIChatWidget'
import CookieBanner from './CookieBanner'

export default function GlobalUI() {
  const pathname = usePathname()

  // Hide global UI elements on admin and portal routes
  const isDashboardRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/portal')

  if (isDashboardRoute) {
    return null
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <AIChatWidget />
      <CookieBanner />
    </>
  )
}

export function GlobalFooter() {
  const pathname = usePathname()
  
  const isDashboardRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/portal')

  if (isDashboardRoute) {
    return null
  }

  return <Footer />
}

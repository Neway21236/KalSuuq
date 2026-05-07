import { redirect } from 'next/navigation'

export default function PortalPage() {
  // Redirect to the partner dashboard. 
  // The middleware will automatically redirect to /portal/login if not authenticated.
  redirect('/portal/dashboard')
}

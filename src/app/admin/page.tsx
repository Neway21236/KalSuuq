import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to the dashboard. The middleware will handle 
  // unauthorized users by pushing them to /admin/login
  redirect('/admin/dashboard')
}

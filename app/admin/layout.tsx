import type React from "react"
import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/admin-layout'

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const user = {
    name: session.name,
    email: session.email,
    role: session.role,
    avatar: session.avatar_url
  }

  return (
    <AdminLayout user={user}>
      {children}
    </AdminLayout>
  )
}

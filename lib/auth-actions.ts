'use server'

import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('🔐 Login attempt for:', email)

  if (!email || !password) return { error: 'Email and password are required' }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    const users = await sql`
      SELECT id, email, name, role, password_hash
      FROM cms.users
      WHERE email = ${email}
      AND is_active = TRUE
      LIMIT 1
    `

    console.log('👤 Users found:', users.length)

    if (users.length === 0) return { error: 'Invalid credentials' }

    const user = users[0]
    console.log('🔍 Comparing password for user:', user.email)

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    console.log('✅ Password valid:', isPasswordValid)
    
    if (!isPasswordValid) return { error: 'Invalid credentials' }

    // Update last login
    await sql`
      UPDATE cms.users 
      SET last_login = NOW() 
      WHERE id = ${user.id}
    `

    cookies().set('admin-session', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return success instead of redirect to avoid NEXT_REDIRECT error
    return { success: true, redirectTo: '/admin', user: { id: user.id, name: user.name, role: user.role } }
  } catch (err) {
    console.error('Login error:', err)
    return { error: 'Login failed' }
  }
}

export async function logoutAction() {
  cookies().delete('admin-session')
  redirect('/auth/login')
}

export async function getSession() {
  const sessionId = cookies().get('admin-session')?.value
  if (!sessionId) return null

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT id, email, name, role, avatar_url, last_login
      FROM cms.users
      WHERE id = ${sessionId}
      AND is_active = TRUE
      LIMIT 1
    `
    return users[0] || null
  } catch (err) {
    console.error('Session error:', err)
    return null
  }
}

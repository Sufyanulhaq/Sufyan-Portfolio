'use server'

import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    const users = await sql`
      SELECT id, email, name, raw_json
      FROM neon_auth.users_sync
      WHERE email = ${email}
      AND deleted_at IS NULL
      LIMIT 1
    `

    if (users.length === 0) return { error: 'Invalid credentials' }

    const user = users[0]
    const userData = user.raw_json as any

    const isPasswordValid = await bcrypt.compare(password, userData.password)
    if (!isPasswordValid) return { error: 'Invalid credentials' }

    cookies().set('admin-session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect('/admin')
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
      SELECT id, email, name
      FROM neon_auth.users_sync
      WHERE id = ${sessionId}
      AND deleted_at IS NULL
      LIMIT 1
    `
    return users[0] || null
  } catch (err) {
    console.error('Session error:', err)
    return null
  }
}

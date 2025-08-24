import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get all users with roles and activity info
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.is_verified,
        u.last_login,
        u.created_at,
        u.updated_at,
        u.avatar_url,
        u.bio,
        u.location,
        u.website,
        u.social_links,
        u.preferences,
        u.login_attempts,
        u.locked_until
      FROM cms.users u
      ORDER BY u.created_at DESC
    `

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        created_at: user.created_at?.toISOString(),
        updated_at: user.updated_at?.toISOString(),
        last_login: user.last_login?.toISOString(),
        locked_until: user.locked_until?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      email, 
      password, 
      phone, 
      role, 
      is_active, 
      is_verified,
      bio,
      location,
      website,
      avatar_url,
      social_links,
      preferences
    } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'editor', 'author', 'viewer', 'moderator']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM cms.users WHERE email = ${email} LIMIT 1
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert new user
    const result = await sql`
      INSERT INTO cms.users (
        name, email, password_hash, phone, role, is_active, is_verified,
        bio, location, website, avatar_url, social_links, preferences
      ) VALUES (
        ${name}, ${email}, ${hashedPassword}, ${phone || null}, ${role}, 
        ${is_active !== undefined ? is_active : true}, 
        ${is_verified !== undefined ? is_verified : false},
        ${bio || null}, ${location || null}, ${website || null}, 
        ${avatar_url || null}, ${social_links || {}}, ${preferences || {}}
      ) RETURNING id
    `

    const userId = result[0].id

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'users', ${userId}, ${JSON.stringify({
          name, email, role, is_active, is_verified, created_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: { id: userId, name, email, role }
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

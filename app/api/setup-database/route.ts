import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL environment variable is not set' },
        { status: 500 }
      )
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Create schema if it doesn't exist
    await sql`CREATE SCHEMA IF NOT EXISTS neon_auth;`
    
    // Drop existing table if it exists to avoid conflicts
    await sql`DROP TABLE IF EXISTS neon_auth.users_sync CASCADE;`
    
    // Create fresh table with minimal constraints - using the most basic Neon-compatible structure
    await sql`
      CREATE TABLE neon_auth.users_sync (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        raw_json JSONB,
        deleted_at TIMESTAMP
      );
    `
    
    // Create admin user with explicit NULL for optional fields
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await sql`
      INSERT INTO neon_auth.users_sync (email, name, raw_json, deleted_at)
      VALUES (
        'admin@example.com',
        'Admin User',
        ${JSON.stringify({ password: hashedPassword })},
        NULL
      );
    `
    
    // Verify the user was created
    const users = await sql`
      SELECT id, email, name FROM neon_auth.users_sync 
      WHERE email = 'admin@example.com'
    `
    
    if (users.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database setup completed successfully!',
        credentials: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { error: `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

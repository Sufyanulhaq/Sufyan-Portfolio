const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Neon Database...\n');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Create schema and table
    console.log('📋 Creating database schema...');
    await sql`
      CREATE SCHEMA IF NOT EXISTS neon_auth;
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS neon_auth.users_sync (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        raw_json JSONB,
        deleted_at TIMESTAMP
      );
    `;
    
    console.log('✅ Database schema created successfully');
    
    // Create admin user
    console.log('\n👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await sql`
      INSERT INTO neon_auth.users_sync (id, email, name, raw_json)
      VALUES (
        'admin-001',
        'admin@example.com',
        'Admin User',
        ${JSON.stringify({ password: hashedPassword })}
      )
      ON CONFLICT (email) DO NOTHING;
    `;
    
    console.log('✅ Admin user created successfully');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    // Verify the user was created
    const users = await sql`
      SELECT id, email, name FROM neon_auth.users_sync 
      WHERE email = 'admin@example.com'
    `;
    
    if (users.length > 0) {
      console.log('\n✅ Database setup completed successfully!');
      console.log('You can now use these credentials to login to the admin panel.');
    } else {
      console.log('\n❌ Failed to create admin user');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();

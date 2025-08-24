const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'setup-database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📖 Reading SQL file...');
    
    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
          await sql.unsafe(statement);
        } catch (error) {
          // Skip if table already exists or other non-critical errors
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1} skipped (already exists): ${error.message}`);
            continue;
          }
          throw error;
        }
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    
    // Verify the setup by checking if tables exist
    console.log('🔍 Verifying database setup...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'cms' 
      ORDER BY table_name
    `;
    
    console.log('📊 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check if admin user exists
    const adminUser = await sql`
      SELECT name, email, role FROM cms.users WHERE role = 'admin' LIMIT 1
    `;
    
    if (adminUser.length > 0) {
      console.log('👤 Admin user created:');
      console.log(`  - Name: ${adminUser[0].name}`);
      console.log(`  - Email: ${adminUser[0].email}`);
      console.log(`  - Role: ${adminUser[0].role}`);
      console.log('🔑 Default password: admin123');
    }
    
    console.log('\n🎉 Database is ready! You can now login to the admin dashboard.');
    console.log('📧 Email: admin@sufyanulhaq.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();

# 🗄️ Database Setup Guide

This guide will help you set up the PostgreSQL database for your portfolio CMS.

## 📋 Prerequisites

1. **Neon Database Account** - You need a Neon PostgreSQL database
2. **Node.js** - Version 16 or higher
3. **Environment Variables** - Your `.env.local` file should contain `DATABASE_URL`

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 2: Set Environment Variables

Create or update your `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Step 3: Run Database Setup

```bash
node scripts/setup-database.js
```

This will:
- Create all necessary database tables
- Set up indexes for performance
- Create default admin user
- Insert sample data

## 🔐 Default Admin Credentials

After setup, you can login with:

- **Email**: `admin@sufyanulhaq.com`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## 📊 Database Schema

The setup creates the following tables:

### Core Tables
- `cms.users` - User accounts and authentication
- `cms.posts` - Blog posts and articles
- `cms.portfolio` - Portfolio projects
- `cms.services` - Service offerings
- `cms.categories` - Content categorization

### CMS Features
- `cms.contact_forms` - Contact form submissions
- `cms.media_library` - File and image management
- `cms.homepage_sections` - Homepage content management
- `cms.seo_settings` - SEO metadata management
- `cms.activity_logs` - User activity tracking
- `cms.newsletter` - Newsletter subscriptions

## 🛠️ Manual Setup (Alternative)

If you prefer to run the SQL manually:

1. Connect to your PostgreSQL database
2. Run the contents of `scripts/setup-database.sql`
3. Verify tables are created

## 🔍 Verification

After setup, you can verify the installation:

```bash
# Check if tables exist
node -e "
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  const tables = await sql\`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'cms'
  \`;
  console.log('Tables:', tables.map(t => t.table_name));
}
check();
"
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Error**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible
   - Ensure SSL mode is set correctly

2. **Permission Error**
   - Verify database user has CREATE privileges
   - Check if schema creation is allowed

3. **Table Already Exists**
   - This is normal, the script handles existing tables
   - Check logs for any skipped statements

### Reset Database

To completely reset the database:

```sql
-- Drop all tables (⚠️ WARNING: This will delete all data!)
DROP SCHEMA cms CASCADE;

-- Re-run the setup script
node scripts/setup-database.js
```

## 📝 Sample Data

The setup includes:

- **Default Admin User** - Full system access
- **Sample Categories** - Web Development, E-commerce, UI/UX, etc.
- **Sample Services** - Web Development, E-commerce, UI/UX Design, Mobile Apps
- **Homepage Sections** - Hero, Services, Portfolio sections

## 🔒 Security Notes

1. **Change Default Password** - Immediately after first login
2. **Database Access** - Restrict database access to your application only
3. **Environment Variables** - Never commit `.env.local` to version control
4. **Regular Backups** - Set up automated database backups

## 📚 Next Steps

After database setup:

1. **Login to Admin Dashboard** - `/auth/login`
2. **Change Admin Password** - Update default credentials
3. **Customize Content** - Add your portfolio projects and services
4. **Configure SEO** - Set up meta tags and descriptions
5. **Upload Media** - Add images and files to media library

## 🆘 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify your database connection string
3. Ensure all environment variables are set
4. Check database permissions and access

---

**Happy coding! 🚀**

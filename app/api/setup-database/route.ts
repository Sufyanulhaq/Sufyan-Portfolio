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
    await sql`CREATE SCHEMA IF NOT EXISTS cms;`
    
    // Drop existing tables to avoid conflicts
    await sql`DROP TABLE IF EXISTS cms.users CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.homepage_sections CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.portfolio CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.services CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.posts CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.contact_forms CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.seo_settings CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.media_library CASCADE;`
    await sql`DROP TABLE IF EXISTS cms.activity_logs CASCADE;`
    
    // 1. Users table with roles
    await sql`
      CREATE TABLE cms.users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
        avatar TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 2. Homepage sections management
    await sql`
      CREATE TABLE cms.homepage_sections (
        id SERIAL PRIMARY KEY,
        section_name TEXT NOT NULL,
        content JSONB NOT NULL,
        seo JSONB,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 3. Portfolio management
    await sql`
      CREATE TABLE cms.portfolio (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        images JSONB,
        videos JSONB,
        category TEXT,
        tags TEXT[],
        client TEXT,
        project_link TEXT,
        github_link TEXT,
        technologies TEXT[],
        seo JSONB,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        views_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 4. Services management
    await sql`
      CREATE TABLE cms.services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        features JSONB,
        icon TEXT,
        image TEXT,
        seo JSONB,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 5. Blog posts management
    await sql`
      CREATE TABLE cms.posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        excerpt TEXT,
        tags TEXT[],
        category TEXT,
        featured_image TEXT,
        video_links JSONB,
        author_id INT REFERENCES cms.users(id),
        seo JSONB,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        published_at TIMESTAMP,
        views_count INT DEFAULT 0,
        likes_count INT DEFAULT 0,
        read_time INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 6. Contact forms management
    await sql`
      CREATE TABLE cms.contact_forms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        message TEXT NOT NULL,
        attachments JSONB,
        is_read BOOLEAN DEFAULT FALSE,
        is_responded BOOLEAN DEFAULT FALSE,
        response TEXT,
        ip_address TEXT,
        user_agent TEXT,
        submitted_at TIMESTAMP DEFAULT NOW(),
        responded_at TIMESTAMP
      );
    `
    
    // 7. SEO settings management
    await sql`
      CREATE TABLE cms.seo_settings (
        id SERIAL PRIMARY KEY,
        page_type TEXT NOT NULL,
        page_id INT,
        meta_title TEXT,
        meta_description TEXT,
        keywords TEXT[],
        canonical_url TEXT,
        og_image TEXT,
        og_title TEXT,
        og_description TEXT,
        twitter_card TEXT,
        structured_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 8. Media library management
    await sql`
      CREATE TABLE cms.media_library (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        mime_type TEXT,
        file_size BIGINT,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        alt_text TEXT,
        tags TEXT[],
        uploaded_by INT REFERENCES cms.users(id),
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // 9. Activity logs for audit trail
    await sql`
      CREATE TABLE cms.activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES cms.users(id),
        action TEXT NOT NULL,
        table_name TEXT,
        record_id INT,
        old_values JSONB,
        new_values JSONB,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await sql`
      INSERT INTO cms.users (name, email, password, role)
      VALUES (
        'Admin User',
        'admin@example.com',
        ${hashedPassword},
        'admin'
      );
    `
    
    // Insert sample homepage sections
    await sql`
      INSERT INTO cms.homepage_sections (section_name, content, seo, display_order) VALUES
      ('hero', '{"title": "Professional Web Developer", "subtitle": "Building modern, scalable web applications", "cta_text": "Get Started", "cta_link": "/contact"}', '{"meta_title": "Sufyan Ul Haq - Professional Web Developer", "meta_description": "Expert web developer specializing in modern web applications, React, Next.js, and full-stack development."}', 1),
      ('about', '{"title": "About Me", "content": "Experienced web developer with expertise in modern technologies", "image": "/images/about-me.jpg"}', '{"meta_title": "About Sufyan Ul Haq - Web Developer", "meta_description": "Learn about my background, skills, and experience in web development."}', 2),
      ('services', '{"title": "Services", "subtitle": "What I offer"}', '{"meta_title": "Web Development Services - Sufyan Ul Haq", "meta_description": "Professional web development services including frontend, backend, and full-stack solutions."}', 3),
      ('portfolio', '{"title": "Portfolio", "subtitle": "Featured Projects"}', '{"meta_title": "Portfolio - Web Development Projects", "meta_description": "View my latest web development projects and case studies."}', 4),
      ('contact', '{"title": "Get In Touch", "subtitle": "Let\'s discuss your project"}', '{"meta_title": "Contact Sufyan Ul Haq - Web Developer", "meta_description": "Get in touch to discuss your web development project requirements."}', 5);
    `
    
    // Insert sample services
    await sql`
      INSERT INTO cms.services (title, description, features, icon, display_order) VALUES
      ('Web Development', 'Custom web applications built with modern technologies', '["Responsive Design", "Performance Optimization", "SEO Best Practices"]', 'code', 1),
      ('Frontend Development', 'React, Next.js, and modern UI frameworks', '["Component Architecture", "State Management", "User Experience"]', 'layout', 2),
      ('Backend Development', 'Node.js, Python, and database design', '["API Development", "Database Design", "Security"]', 'server', 3),
      ('E-commerce Solutions', 'Full-featured online stores and marketplaces', '["Payment Integration", "Inventory Management", "Order Processing"]', 'shopping-cart', 4);
    `
    
    // Insert sample portfolio items
    await sql`
      INSERT INTO cms.portfolio (title, description, category, technologies, status, featured) VALUES
      ('E-commerce Platform', 'Modern e-commerce solution with advanced features', 'Web Application', '["React", "Node.js", "PostgreSQL"]', 'published', true),
      ('Analytics Dashboard', 'Real-time data visualization dashboard', 'Web Application', '["Next.js", "TypeScript", "Chart.js"]', 'published', true),
      ('Portfolio Website', 'Professional portfolio and business website', 'Website', '["Next.js", "Tailwind CSS", "Framer Motion"]', 'published', true);
    `
    
    // Insert sample blog posts
    await sql`
      INSERT INTO cms.posts (title, slug, excerpt, category, status, author_id, read_time) VALUES
      ('Building Modern Web Applications', 'building-modern-web-applications', 'Learn the best practices for building scalable web applications', 'Development', 'published', 1, 8),
      ('The Future of Web Development', 'future-of-web-development', 'Explore upcoming trends and technologies in web development', 'Technology', 'published', 1, 12),
      ('SEO Best Practices for 2025', 'seo-best-practices-2025', 'Stay ahead with these proven SEO strategies', 'SEO', 'published', 1, 10);
    `
    
    // Verify the setup
    const userCount = await sql`SELECT COUNT(*) FROM cms.users WHERE role = 'admin'`
    const sectionCount = await sql`SELECT COUNT(*) FROM cms.homepage_sections`
    const serviceCount = await sql`SELECT COUNT(*) FROM cms.services`
    const portfolioCount = await sql`SELECT COUNT(*) FROM cms.portfolio`
    const postCount = await sql`SELECT COUNT(*) FROM cms.posts`
    
    if (userCount[0].count > 0) {
      return NextResponse.json({
        success: true,
        message: 'Advanced CMS database setup completed successfully!',
        stats: {
          admin_users: parseInt(userCount[0].count),
          homepage_sections: parseInt(sectionCount[0].count),
          services: parseInt(serviceCount[0].count),
          portfolio_items: parseInt(portfolioCount[0].count),
          blog_posts: parseInt(postCount[0].count)
        },
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

-- CMS Database Setup Script
-- This script creates all necessary tables for the portfolio CMS

-- Create CMS schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cms;

-- Users table
CREATE TABLE IF NOT EXISTS cms.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'author', 'viewer', 'moderator')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website TEXT,
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS cms.posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    author_id INTEGER REFERENCES cms.users(id),
    category_id INTEGER,
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    seo_data JSONB DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS cms.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES cms.categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS cms.portfolio (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image TEXT,
    gallery_images TEXT[],
    technologies TEXT[],
    project_url TEXT,
    github_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES cms.categories(id),
    author_id INTEGER REFERENCES cms.users(id),
    meta_title VARCHAR(255),
    meta_description TEXT,
    seo_data JSONB DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS cms.services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    long_description TEXT,
    icon VARCHAR(100),
    featured_image TEXT,
    price_range VARCHAR(100),
    features TEXT[],
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    seo_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact forms table
CREATE TABLE IF NOT EXISTS cms.contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
    is_read BOOLEAN DEFAULT FALSE,
    source VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    response_sent BOOLEAN DEFAULT FALSE,
    response_sent_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media library table
CREATE TABLE IF NOT EXISTS cms.media_library (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    alt_text TEXT,
    caption TEXT,
    usage_count INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES cms.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage sections table
CREATE TABLE IF NOT EXISTS cms.homepage_sections (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(255) NOT NULL,
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN ('hero', 'content', 'image', 'layout', 'testimonial', 'cta')),
    title VARCHAR(255),
    subtitle TEXT,
    content TEXT,
    background_image TEXT,
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    layout VARCHAR(50) DEFAULT 'container',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    custom_css TEXT,
    updated_by INTEGER REFERENCES cms.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO settings table
CREATE TABLE IF NOT EXISTS cms.seo_settings (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT[],
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    twitter_card VARCHAR(50),
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image TEXT,
    structured_data JSONB,
    canonical_url TEXT,
    user_id INTEGER REFERENCES cms.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS cms.activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES cms.users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS cms.newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON cms.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON cms.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON cms.users(is_active);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON cms.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON cms.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON cms.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON cms.posts(published_at);

CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON cms.portfolio(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON cms.portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON cms.portfolio(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON cms.portfolio(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_author ON cms.portfolio(author_id);

CREATE INDEX IF NOT EXISTS idx_posts_featured ON cms.posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_category ON cms.posts(category_id);

CREATE INDEX IF NOT EXISTS idx_services_slug ON cms.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON cms.services(status);

CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON cms.contact_forms(status);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created ON cms.contact_forms(created_at);

CREATE INDEX IF NOT EXISTS idx_media_library_category ON cms.media_library(category);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON cms.media_library(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_type ON cms.homepage_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON cms.homepage_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON cms.homepage_sections(sort_order);

CREATE INDEX IF NOT EXISTS idx_seo_settings_table_record ON cms.seo_settings(table_name, record_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON cms.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_table ON cms.activity_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON cms.activity_logs(created_at);

-- Insert default admin user
INSERT INTO cms.users (name, email, password_hash, role, is_active, is_verified) 
VALUES (
    'Admin User', 
    'admin@sufyanulhaq.com', 
    '$2b$12$Ojtt07P6T6IbJQ0W9rgRxOYNUvh/n9pStwYtL4F5BkcWay.dID94C', -- password: admin123
    'admin', 
    TRUE, 
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO cms.categories (name, slug, description, is_active) VALUES
('Web Development', 'web-development', 'Web development services and projects', TRUE),
('E-commerce', 'ecommerce', 'E-commerce solutions and platforms', TRUE),
('UI/UX Design', 'ui-ux-design', 'User interface and experience design', TRUE),
('Mobile Apps', 'mobile-apps', 'Mobile application development', TRUE),
('Consulting', 'consulting', 'Technical consulting services', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Insert default services
INSERT INTO cms.services (title, slug, description, content, icon, status, featured, sort_order) VALUES
('Web Development', 'web-development', 'Custom web applications and websites', 'Professional web development services using modern technologies', 'code', 'active', TRUE, 1),
('E-commerce Solutions', 'ecommerce', 'Complete e-commerce platform development', 'End-to-end e-commerce solutions for online businesses', 'shopping-cart', 'active', TRUE, 2),
('UI/UX Design', 'ui-ux-design', 'User-centered design solutions', 'Beautiful and intuitive user interfaces with exceptional user experience', 'palette', 'active', TRUE, 3),
('Mobile App Development', 'mobile-apps', 'Cross-platform mobile applications', 'Native and cross-platform mobile app development', 'smartphone', 'active', TRUE, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert default homepage sections
INSERT INTO cms.homepage_sections (section_name, section_type, title, subtitle, content, is_active, is_published, sort_order) VALUES
('Hero Section', 'hero', 'Professional Web Developer', 'Creating digital experiences that drive results', 'Full-stack web developer specializing in modern web technologies and user-centered design.', TRUE, TRUE, 1),
('Services Overview', 'content', 'What I Offer', 'Comprehensive web development services', 'Professional web development, e-commerce solutions, UI/UX design, and mobile app development.', TRUE, TRUE, 2),
('Portfolio Showcase', 'content', 'Featured Work', 'Recent projects and achievements', 'Explore my latest work and see how I help businesses achieve their digital goals.', TRUE, TRUE, 3)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON cms.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON cms.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON cms.portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON cms.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_forms_updated_at BEFORE UPDATE ON cms.contact_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON cms.media_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON cms.homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON cms.seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your database setup)
-- GRANT ALL PRIVILEGES ON SCHEMA cms TO your_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cms TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA cms TO your_user;

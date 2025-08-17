# 🚀 Sufyan's Portfolio Website

A modern, high-performance personal portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a comprehensive admin dashboard, blog system, portfolio showcase, and PWA capabilities.

## ✨ Features

### 🌟 **Frontend**
- **Modern Design**: Clean, responsive design with smooth animations
- **PWA Ready**: Progressive Web App with offline support
- **Mobile Optimized**: Fully responsive across all devices
- **Performance**: Optimized for speed and SEO

### 🎯 **Core Pages**
- **Homepage**: Hero section, skills showcase, and CTA
- **About**: Professional bio, skills, and experience
- **Portfolio**: Project showcase with filtering and categories
- **Services**: Service offerings with pricing
- **Blog**: Content management with categories and tags
- **Contact**: Contact form with lead management

### 🔐 **Admin Dashboard**
- **User Management**: Role-based access control
- **Content Management**: Posts, projects, and categories
- **Analytics**: Comprehensive website analytics
- **Comments**: Moderation and spam protection
- **Statistics**: Real-time performance metrics

### 🛠 **Technical Features**
- **Authentication**: NextAuth.js with role-based permissions
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with proper error handling
- **Security**: Input validation, rate limiting, and CSRF protection
- **Performance**: Image optimization and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sufyan-portfolio.git
cd sufyan-portfolio
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Environment Setup
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Email and Analytics
RESEND_API_KEY=your-resend-api-key
GOOGLE_ANALYTICS_ID=your-ga-id
```

### 4. Database Setup
```bash
# Start MongoDB locally (if using local MongoDB)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

### 5. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed Database (Optional)
Populate your database with sample data to see the website in action:

```bash
# Seed with sample data
pnpm seed
# or
npm run seed

# Test the seeded data
pnpm test:seed
# or
npm run test:seed
```

**Default Login Credentials:**
- **Super Admin**: `sufyan@example.com` / `admin123`
- **Editor**: `sarah@example.com` / `editor123`
- **User**: `mike@example.com` / `user123`

## 🏗️ Project Structure

```
sufyan-portfolio/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── portfolio/         # Portfolio pages
│   └── services/          # Services pages
├── components/             # React components
│   ├── ui/                # UI components (Radix UI)
│   ├── auth/              # Authentication components
│   └── animations/        # Framer Motion animations
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize your color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#0ea5e9",
        foreground: "#ffffff",
      },
      accent: {
        DEFAULT: "#8b5cf6",
        foreground: "#ffffff",
      },
    },
  },
}
```

### Content
- **Portfolio Projects**: Edit `components/portfolio-grid.tsx`
- **Services**: Update `app/services/page.tsx`
- **About**: Modify `app/about/page.tsx`
- **Blog Posts**: Use the admin dashboard or edit `models/Post.ts`

### Styling
- **Global Styles**: Edit `app/globals.css`
- **Component Styles**: Use Tailwind CSS classes
- **Animations**: Modify `components/animations/`

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel**
- Connect your GitHub repository to Vercel
- Set environment variables in Vercel dashboard
- Deploy automatically on push

3. **Environment Variables in Vercel**
```env
MONGODB_URI=your-mongodb-atlas-uri
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

### Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Railway
- Connect GitHub repository
- Set environment variables
- Automatic deployment

## 🔧 Configuration

### Database Models
All models are in the `models/` directory:
- `User.ts` - User management and authentication
- `Post.ts` - Blog posts and content
- `Project.ts` - Portfolio projects
- `Category.ts` - Content categories
- `Tag.ts` - Content tags
- `Comment.ts` - User comments
- `ContactForm.ts` - Contact submissions
- `Newsletter.ts` - Newsletter subscriptions
- `UserActivity.ts` - User activity tracking

### API Routes
API endpoints are in `app/api/`:
- `/api/auth/*` - Authentication
- `/api/admin/*` - Admin panel
- `/api/blog/*` - Blog content
- `/api/portfolio/*` - Portfolio projects
- `/api/contact` - Contact form
- `/api/newsletter` - Newsletter

### Authentication
- **NextAuth.js** for authentication
- **Role-based access control** (SUPER_ADMIN, ADMIN, EDITOR, VIEWER, USER)
- **JWT sessions** with secure configuration

## 📱 PWA Features

The website includes Progressive Web App features:
- Service Worker for offline support
- Web App Manifest
- Install prompt
- Responsive design
- Fast loading

## 🔒 Security Features

- **Input Validation**: Zod schema validation
- **Rate Limiting**: API request throttling
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Protection**: Content Security Policy
- **Secure Headers**: Security-focused HTTP headers

## 📊 Analytics & Monitoring

- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Page views, user behavior
- **Error Tracking**: Comprehensive error logging
- **SEO Optimization**: Meta tags, structured data

## 🧪 Testing

```
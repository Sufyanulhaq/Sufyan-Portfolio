# 🚀 Deployment Guide - Vercel

This guide will walk you through deploying your portfolio website to Vercel, the recommended hosting platform for Next.js applications.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Database** - Either local or MongoDB Atlas
4. **Environment Variables** - Ready to configure

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Portfolio website ready for deployment"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/sufyan-portfolio.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Repository Structure
Ensure your repository has these key files:
- `package.json` - Dependencies and scripts
- `next.config.mjs` - Next.js configuration
- `vercel.json` - Vercel deployment config
- `.env.local` - Environment variables (don't commit this!)
- `README.md` - Project documentation

## 🌐 Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**
   - Choose "Free" tier
   - Select your preferred region
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Create a new database user
   - Set username and password
   - Assign "Read and write to any database" role

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (or add specific IPs)

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### Option B: Local MongoDB

```bash
# Install MongoDB locally
# macOS with Homebrew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your `sufyan-portfolio` repository
   - Click "Import"

### 3.2 Configure Project Settings

1. **Project Name**
   - Set a custom domain (optional)
   - Choose your preferred project name

2. **Framework Preset**
   - Vercel should auto-detect Next.js
   - If not, select "Next.js" manually

3. **Root Directory**
   - Leave as `./` (root of repository)

4. **Build and Output Settings**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### 3.3 Environment Variables

**⚠️ CRITICAL: Set these before deploying!**

Click "Environment Variables" and add:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Optional
RESEND_API_KEY=your-resend-api-key
GOOGLE_ANALYTICS_ID=your-ga-id
```

**Generate NEXTAUTH_SECRET:**
```bash
# In your terminal
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy

1. **Click "Deploy"**
   - Vercel will build and deploy your project
   - This may take 2-5 minutes

2. **Monitor Build Process**
   - Watch the build logs for any errors
   - Common issues: missing dependencies, build errors

3. **Success!**
   - Your site will be available at `https://your-project.vercel.app`

## 🔍 Step 4: Post-Deployment Setup

### 4.1 Create Admin User

1. **Access Your Site**
   - Go to your deployed URL
   - Navigate to `/auth/register`

2. **Register Admin Account**
   - Create your first user account
   - This will be a regular user initially

3. **Promote to Admin**
   - Connect to your MongoDB database
   - Update the user's role to "ADMIN" or "SUPER_ADMIN"

```javascript
// In MongoDB shell or Compass
use portfolio
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "ADMIN" } }
)
```

### 4.2 Seed Sample Data (Optional)
Before testing, you can populate your database with sample content:

```bash
# In your local development environment
npm run seed

# This will create:
# - Sample users (admin, editor, user)
# - Portfolio projects
# - Blog posts
# - Categories and tags
# - Sample comments and contacts
```

### 4.3 Test Admin Dashboard

1. **Sign In**
   - Go to `/auth/login`
   - Sign in with your admin account
   - **Default credentials**: `sufyan@example.com` / `admin123`

2. **Access Admin Panel**
   - Navigate to `/admin`
   - You should see the dashboard with sample data

3. **Test Features**
   - Browse the sample blog posts and projects
   - Check the analytics dashboard
   - Test user management
   - Explore content management features

## 🎯 Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain

2. **Update Environment Variables**
   - Change `NEXTAUTH_URL` to your custom domain
   - Redeploy if necessary

### 5.2 DNS Configuration

1. **Add CNAME Record**
   - Point your domain to `cname.vercel-dns.com`
   - Or use the specific Vercel DNS settings

2. **Verify Domain**
   - Vercel will verify your domain ownership
   - This may take up to 24 hours

## 🔧 Step 6: Production Optimization

### 6.1 Performance Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor Core Web Vitals

2. **Lighthouse CI**
   - Set up automated performance testing
   - Monitor performance scores

### 6.2 Security Hardening

1. **Security Headers**
   - Already configured in `vercel.json`
   - Monitor security reports

2. **Rate Limiting**
   - Consider implementing API rate limiting
   - Monitor for abuse

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel
# Common causes:
# - Missing dependencies
# - TypeScript errors
# - Environment variable issues
```

#### Database Connection Issues
```bash
# Verify MONGODB_URI format
# Check network access in MongoDB Atlas
# Ensure database user has correct permissions
```

#### Authentication Issues
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
# Ensure environment variables are correct
```

### Debug Commands

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify environment variables
node -e "console.log(process.env.MONGODB_URI)"
```

## 📊 Monitoring & Maintenance

### 1. **Regular Checks**
- Monitor Vercel analytics
- Check database performance
- Review error logs

### 2. **Updates**
- Keep dependencies updated
- Monitor Next.js releases
- Update security patches

### 3. **Backups**
- Regular database backups
- Code repository backups
- Environment variable backups

## 🎉 Success!

Your portfolio website is now deployed and ready for the world! 

### Next Steps:
1. **Customize Content** - Update portfolio projects, services, and about page
2. **Add Blog Posts** - Start writing content through the admin dashboard
3. **SEO Optimization** - Add meta tags and structured data
4. **Analytics** - Set up Google Analytics or other tracking
5. **Marketing** - Share your portfolio on social media and professional networks

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Happy coding! 🚀**

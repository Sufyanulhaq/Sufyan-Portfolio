# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Set up in Vercel dashboard

## 🔧 Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

```bash
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Contact Form Configuration
CONTACT_FORM_TOKEN=contact-form-secret-token
NEWSLETTER_TOKEN=newsletter-secret-token

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hello@sufyanulhaq.com
SMTP_PASS=your-app-password-here
CONTACT_EMAIL=hello@sufyanulhaq.com

# Environment
NODE_ENV=production
```

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Connect GitHub Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Output Directory: `.next`

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 2: Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🔍 Troubleshooting

### Build Errors

If you encounter build errors:

1. **Clear Build Cache**:
   ```bash
   rm -rf .next
   rm -rf node_modules
   pnpm install
   ```

2. **Check Dependencies**:
   ```bash
   pnpm build
   ```

3. **Verify Environment Variables**:
   - Ensure all required env vars are set in Vercel
   - Check MongoDB connection string

### Common Issues

1. **MongoDB Connection**:
   - Ensure MongoDB Atlas allows connections from Vercel
   - Check IP whitelist in MongoDB Atlas

2. **API Routes**:
   - Verify all API routes are working locally
   - Check for missing dependencies

3. **Build Timeout**:
   - Vercel has a 10-minute build limit
   - Optimize build process if needed

## 📱 Post-Deployment

1. **Test All Features**:
   - Homepage
   - Blog
   - Portfolio
   - Contact Form
   - Admin Dashboard

2. **Set Custom Domain** (Optional):
   - Go to Vercel project settings
   - Add custom domain
   - Update DNS records

3. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Core Web Vitals

## 🔒 Security Considerations

1. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use Vercel's environment variable system

2. **API Routes**:
   - Implement proper authentication
   - Add rate limiting if needed

3. **Database**:
   - Use MongoDB Atlas with proper security
   - Implement connection pooling

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**: Project dashboard → Functions → View logs
2. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
3. **GitHub Issues**: Create an issue in your repository

## 🎉 Success!

Once deployed, your portfolio will be available at:
`https://your-project-name.vercel.app`

---

**Happy Deploying! 🚀✨**

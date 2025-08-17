# Database Seeder

This directory contains scripts for seeding your portfolio website database with sample data.

## 🚀 Quick Start

### 1. Set up Environment Variables
Make sure you have a `.env.local` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
```

### 2. Run the Seeder
```bash
# Using npm
npm run seed

# Using pnpm
pnpm seed

# Using yarn
yarn seed
```

## 📊 What Gets Created

### Users
- **Sufyan Ul Haq** (Super Admin) - `sufyan@example.com` / `admin123`
- **Sarah Chen** (Editor) - `sarah@example.com` / `editor123`
- **Mike Johnson** (User) - `mike@example.com` / `user123`

### Content
- **6 Categories**: Web Development, Mobile Apps, UI/UX Design, E-commerce, API Development, Performance
- **10 Tags**: React, Next.js, TypeScript, Node.js, MongoDB, Tailwind CSS, Framer Motion, AWS, Docker, GraphQL
- **5 Portfolio Projects**: E-commerce Platform, Task Management App, Weather Dashboard, Blog CMS, Real Estate Platform
- **5 Blog Posts**: Next.js 15 Guide, TypeScript Guide, React Performance, MongoDB Best Practices, PWA Guide
- **4 Comments**: Sample comments on blog posts
- **3 Contact Forms**: Sample client inquiries
- **3 Newsletter Subscriptions**: Sample subscribers
- **User Activities**: Sample user interactions

## 🔧 Customization

### Adding More Data
Edit `seed-database.js` to add:
- More users with different roles
- Additional categories and tags
- More portfolio projects
- Additional blog posts
- Sample testimonials

### Modifying Existing Data
Update the sample data arrays in the seeder file:
- Change project descriptions
- Update blog post content
- Modify user information
- Adjust categories and tags

## ⚠️ Important Notes

1. **This will clear existing data** - The seeder deletes all existing data before creating new sample data
2. **Use in development only** - Don't run this on production databases
3. **Environment variables required** - Make sure MONGODB_URI is set
4. **Dependencies required** - Ensure all models are properly imported

## 🚨 Troubleshooting

### Common Issues

**Connection Error**
```bash
# Check your MONGODB_URI in .env.local
# Ensure MongoDB is running
# Verify network access for Atlas
```

**Model Import Error**
```bash
# Check that all model files exist
# Verify import paths in seed-database.js
# Ensure models are properly exported
```

**Permission Error**
```bash
# Check database user permissions
# Ensure write access to the database
# Verify connection string format
```

## 📝 Example Usage

```bash
# Development seeding
npm run seed:dev

# Production-like seeding (if needed)
npm run seed

# Check the output for success messages
# Look for the summary at the end
```

## 🎯 After Seeding

1. **Test the admin dashboard** - Login with `sufyan@example.com` / `admin123`
2. **Explore the portfolio** - Check out the sample projects
3. **Read the blog** - Browse the sample blog posts
4. **Test user roles** - Try different user accounts
5. **Customize content** - Replace sample data with your own

---

**Happy seeding! 🌱**

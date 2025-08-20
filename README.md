# Sufyan Portfolio

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database

### Installation
```bash
# Clone the repository
git clone https://github.com/Sufyanulhaq/Sufyan-Portfolio.git
cd Sufyan-Portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
pnpm dev
```

## 🌟 Features

- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Blog System**: Full-featured blog with categories and tags
- **Portfolio Showcase**: Project gallery with filtering and search
- **Admin Dashboard**: Content management system
- **Authentication**: NextAuth.js with role-based access control
- **PWA Ready**: Progressive Web App capabilities
- **SEO Optimized**: Built-in SEO features
- **Contact Forms**: Working contact and newsletter forms
- **Email Integration**: Nodemailer for form notifications

## 🗄️ Database Setup

### MongoDB Connection
The application uses MongoDB with Mongoose. Set your `MONGODB_URI` in `.env.local`.

### Seed Database
Populate your database with sample data:

```bash
# Seed with production data
pnpm seed

# Seed with development data
pnpm seed:dev
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
Sufyan-Portfolio/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   └── portfolio/         # Portfolio pages
├── components/             # Reusable UI components
├── lib/                    # Utility functions
├── models/                 # Mongoose models
└── scripts/                # Database seeding scripts
```

## 🎨 Customization

- **Colors**: Update Tailwind config in `tailwind.config.js`
- **Content**: Modify data in the seeding scripts
- **Styling**: Customize components in the `components/` directory
- **Layout**: Adjust page layouts in `app/` directory

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Email (Contact Form)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
CONTACT_EMAIL=hello@sufyanulhaq.com

# Tokens
CONTACT_FORM_TOKEN=your_contact_form_token
NEWSLETTER_TOKEN=your_newsletter_token
```

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` after creating a user with admin privileges.

### Default Admin User
After seeding, you can log in with:
- **Email**: admin@example.com
- **Password**: admin123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Sufyan using Next.js, TypeScript, and Tailwind CSS**

<!-- Test line to verify git is working -->
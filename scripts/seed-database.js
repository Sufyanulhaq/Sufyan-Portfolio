const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Import models
const User = require('../models/User');
const Post = require('../models/Post');
const Project = require('../models/Project');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Comment = require('../models/Comment');
const ContactForm = require('../models/ContactForm');
const Newsletter = require('../models/Newsletter');
const UserActivity = require('../models/UserActivity');

// Sample data
const sampleUsers = [
  {
    name: "Sufyan Ul Haq",
    email: "sufyan@example.com",
    password: "admin123",
    role: "SUPER_ADMIN",
    bio: "Full-stack developer passionate about creating exceptional digital experiences",
    website: "https://sufyanulhaq.com",
    github: "https://github.com/sufyanulhaq",
    linkedin: "https://linkedin.com/in/sufyanulhaq",
    twitter: "https://twitter.com/sufyanulhaq",
    isActive: true,
    isEmailVerified: true,
  },
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "editor123",
    role: "EDITOR",
    bio: "Content strategist and UX writer",
    isActive: true,
    isEmailVerified: true,
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "user123",
    role: "USER",
    bio: "Frontend developer and UI enthusiast",
    isActive: true,
    isEmailVerified: true,
  }
];

const sampleCategories = [
  { name: "Web Development", slug: "web-development", color: "#0ea5e9" },
  { name: "Mobile Apps", slug: "mobile-apps", color: "#8b5cf6" },
  { name: "UI/UX Design", slug: "ui-ux-design", color: "#10b981" },
  { name: "E-commerce", slug: "e-commerce", color: "#f59e0b" },
  { name: "API Development", slug: "api-development", color: "#ef4444" },
  { name: "Performance", slug: "performance", color: "#06b6d4" }
];

const sampleTags = [
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#000000" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Node.js", color: "#339933" },
  { name: "MongoDB", color: "#47a248" },
  { name: "Tailwind CSS", color: "#06b6d4" },
  { name: "Framer Motion", color: "#0055ff" },
  { name: "AWS", color: "#ff9900" },
  { name: "Docker", color: "#2496ed" },
  { name: "GraphQL", color: "#e10098" }
];

const sampleProjects = [
  {
    title: "Modern E-commerce Platform",
    slug: "modern-ecommerce-platform",
    description: "A full-stack e-commerce solution with advanced features",
    longDescription: "Built a comprehensive e-commerce platform featuring user authentication, product management, shopping cart, payment processing with Stripe, order management, and admin dashboard. The platform includes real-time inventory tracking, customer reviews, and analytics.",
    coverImage: "/modern-ecommerce-dashboard.png",
    images: ["/ecommerce-1.png", "/ecommerce-2.png", "/ecommerce-3.png"],
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    category: "E-commerce",
    featured: true,
    liveUrl: "https://ecommerce-demo.sufyan.dev",
    githubUrl: "https://github.com/sufyan/ecommerce-platform",
    status: "COMPLETED",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-20"),
    client: "TechStart Inc.",
    testimonial: {
      content: "Sufyan delivered an exceptional e-commerce platform that exceeded our expectations. The user experience is seamless and the performance is outstanding.",
      author: "Jennifer Martinez",
      position: "CTO",
      company: "TechStart Inc."
    }
  },
  {
    title: "Task Management App",
    slug: "task-management-app",
    description: "Collaborative project management with real-time updates",
    longDescription: "Developed a comprehensive task management application that enables teams to collaborate effectively. Features include real-time updates, task assignment, progress tracking, file sharing, and comprehensive reporting. Built with modern technologies for optimal performance.",
    coverImage: "/task-management-app.png",
    images: ["/task-app-1.png", "/task-app-2.png"],
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Socket.io"],
    category: "Web Development",
    featured: true,
    liveUrl: "https://tasks.sufyan.dev",
    githubUrl: "https://github.com/sufyan/task-manager",
    status: "COMPLETED",
    startDate: new Date("2023-11-01"),
    endDate: new Date("2024-01-10"),
    client: "InnovateCorp",
    testimonial: {
      content: "This task management app has revolutionized how our team collaborates. The real-time features and intuitive interface make project management a breeze.",
      author: "David Kim",
      position: "Project Manager",
      company: "InnovateCorp"
    }
  },
  {
    title: "Weather Dashboard",
    slug: "weather-dashboard",
    description: "Interactive weather application with location-based forecasts",
    longDescription: "Created a responsive weather dashboard that provides accurate forecasts based on user location. Features include current conditions, hourly and daily forecasts, weather maps, and customizable alerts. The app uses multiple weather APIs for redundancy and accuracy.",
    coverImage: "/weather-dashboard.png",
    images: ["/weather-1.png", "/weather-2.png"],
    technologies: ["React", "Chart.js", "OpenWeather API", "CSS Modules"],
    category: "Mobile Apps",
    featured: false,
    liveUrl: "https://weather.sufyan.dev",
    githubUrl: "https://github.com/sufyan/weather-dashboard",
    status: "COMPLETED",
    startDate: new Date("2023-09-15"),
    endDate: new Date("2023-10-30"),
    client: "WeatherTech Solutions"
  },
  {
    title: "Blog CMS",
    slug: "blog-cms",
    description: "Content management system with markdown support",
    longDescription: "Built a modern content management system specifically designed for bloggers and content creators. Features include markdown editing, SEO optimization, analytics, user management, and responsive design. The system is optimized for performance and SEO.",
    coverImage: "/blog-cms-admin.png",
    images: ["/cms-1.png", "/cms-2.png"],
    technologies: ["Next.js", "MDX", "Supabase", "Tailwind CSS"],
    category: "Web Development",
    featured: false,
    liveUrl: "https://blog-cms.sufyan.dev",
    githubUrl: "https://github.com/sufyan/blog-cms",
    status: "COMPLETED",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2023-09-14"),
    client: "ContentPro Media"
  },
  {
    title: "Real Estate Platform",
    slug: "real-estate-platform",
    description: "Comprehensive property listing and search platform",
    longDescription: "Developed a full-featured real estate platform with advanced search capabilities, property listings, virtual tours, and agent management. The platform includes interactive maps, property comparisons, and lead generation tools.",
    coverImage: "/real-estate-platform.png",
    images: ["/realestate-1.png", "/realestate-2.png"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Mapbox"],
    category: "Web Development",
    featured: true,
    liveUrl: "https://realestate.sufyan.dev",
    githubUrl: "https://github.com/sufyan/real-estate",
    status: "COMPLETED",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-07-31"),
    client: "RealEstate Pro",
    testimonial: {
      content: "Sufyan's real estate platform has transformed our business. The search functionality and user experience are unmatched in the industry.",
      author: "Maria Rodriguez",
      position: "CEO",
      company: "RealEstate Pro"
    }
  }
];

const samplePosts = [
  {
    title: "Building Scalable Web Applications with Next.js 15",
    slug: "building-scalable-web-applications-nextjs-15",
    content: `
# Building Scalable Web Applications with Next.js 15

Next.js 15 introduces groundbreaking features that make building scalable web applications easier than ever. In this comprehensive guide, we'll explore the new capabilities and how to leverage them for production applications.

## Key Features

### 1. App Router Improvements
The App Router has received significant enhancements, including better performance and improved developer experience.

### 2. Server Components
Server Components continue to evolve, offering better performance and SEO capabilities.

### 3. Streaming and Suspense
Enhanced streaming capabilities for better user experience.

## Best Practices

- Use Server Components for static content
- Implement proper error boundaries
- Optimize images with next/image
- Leverage middleware for authentication

## Performance Tips

1. **Code Splitting**: Automatic route-based code splitting
2. **Image Optimization**: Built-in image optimization
3. **Caching**: Intelligent caching strategies
4. **Bundle Analysis**: Monitor bundle sizes

## Conclusion

Next.js 15 represents a significant step forward in the React ecosystem, making it easier to build fast, scalable web applications.
    `,
    excerpt: "Explore the new features in Next.js 15 and learn how to build scalable web applications with improved performance and developer experience.",
    coverImage: "/nextjs-15-guide.png",
    published: true,
    featured: true,
    category: "Web Development",
    tags: ["Next.js", "React", "Performance", "Web Development"],
    readTime: 8
  },
  {
    title: "The Complete Guide to TypeScript in 2024",
    slug: "complete-guide-typescript-2024",
    content: `
# The Complete Guide to TypeScript in 2024

TypeScript has become the standard for building robust JavaScript applications. This guide covers everything you need to know about TypeScript in 2024.

## Why TypeScript?

TypeScript provides:
- Static type checking
- Better IDE support
- Enhanced refactoring capabilities
- Improved code quality

## Advanced Features

### 1. Generics
Generics allow you to create reusable components with type safety.

### 2. Utility Types
Built-in utility types for common transformations.

### 3. Decorators
Metadata programming capabilities.

## Migration Strategies

- Start with JavaScript files
- Gradually add type annotations
- Use strict mode for better safety
- Leverage existing type definitions

## Best Practices

1. **Type Definitions**: Create comprehensive type definitions
2. **Interfaces vs Types**: Choose the right abstraction
3. **Error Handling**: Implement proper error types
4. **Testing**: Use TypeScript for test files

## Conclusion

TypeScript continues to evolve and improve, making it an essential tool for modern web development.
    `,
    excerpt: "Master TypeScript in 2024 with this comprehensive guide covering advanced features, best practices, and migration strategies.",
    coverImage: "/typescript-guide-2024.png",
    published: true,
    featured: false,
    category: "Web Development",
    tags: ["TypeScript", "JavaScript", "Web Development", "Programming"],
    readTime: 12
  },
  {
    title: "Optimizing React Performance: A Deep Dive",
    slug: "optimizing-react-performance-deep-dive",
    content: `
# Optimizing React Performance: A Deep Dive

Performance optimization is crucial for React applications. This guide explores advanced techniques for improving your React app's performance.

## Performance Metrics

### Core Web Vitals
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### React-Specific Metrics
- Component render times
- Bundle size
- Memory usage

## Optimization Techniques

### 1. Memoization
Use React.memo, useMemo, and useCallback effectively.

### 2. Code Splitting
Implement dynamic imports and lazy loading.

### 3. Virtualization
Handle large lists efficiently.

### 4. Bundle Optimization
Reduce bundle size with proper tree shaking.

## Tools and Libraries

- React DevTools Profiler
- Lighthouse
- Bundle Analyzer
- Performance Monitor

## Best Practices

1. **Avoid Unnecessary Re-renders**
2. **Optimize Bundle Size**
3. **Use Production Builds**
4. **Implement Proper Caching**

## Conclusion

Performance optimization is an ongoing process that requires understanding of both React internals and web performance fundamentals.
    `,
    excerpt: "Learn advanced techniques for optimizing React performance, including memoization, code splitting, and performance monitoring.",
    coverImage: "/react-performance-guide.png",
    published: true,
    featured: false,
    category: "Web Development",
    tags: ["React", "Performance", "Optimization", "Web Development"],
    readTime: 15
  },
  {
    title: "MongoDB Best Practices for Production Applications",
    slug: "mongodb-best-practices-production",
    content: `
# MongoDB Best Practices for Production Applications

MongoDB is a powerful NoSQL database, but using it effectively in production requires following best practices.

## Database Design

### 1. Schema Design
- Embed vs. Reference decisions
- Indexing strategies
- Data modeling patterns

### 2. Performance Considerations
- Query optimization
- Aggregation pipeline efficiency
- Connection pooling

## Security

### 1. Authentication
- User management
- Role-based access control
- Network security

### 2. Data Protection
- Encryption at rest
- Encryption in transit
- Backup strategies

## Monitoring and Maintenance

### 1. Performance Monitoring
- Query performance
- Index usage
- Resource utilization

### 2. Backup and Recovery
- Automated backups
- Point-in-time recovery
- Disaster recovery planning

## Best Practices

1. **Use Proper Indexes**
2. **Implement Connection Pooling**
3. **Monitor Performance Metrics**
4. **Regular Maintenance**

## Conclusion

Following MongoDB best practices ensures your production applications are secure, performant, and maintainable.
    `,
    excerpt: "Discover essential MongoDB best practices for production applications, including security, performance, and maintenance strategies.",
    coverImage: "/mongodb-best-practices.png",
    published: true,
    featured: false,
    category: "API Development",
    tags: ["MongoDB", "Database", "Backend", "Performance"],
    readTime: 10
  },
  {
    title: "Building Progressive Web Apps in 2024",
    slug: "building-progressive-web-apps-2024",
    content: `
# Building Progressive Web Apps in 2024

Progressive Web Apps (PWAs) continue to evolve, offering native app-like experiences on the web. This guide covers modern PWA development.

## PWA Fundamentals

### 1. Service Workers
- Offline functionality
- Background sync
- Push notifications

### 2. Web App Manifest
- App metadata
- Installation prompts
- Native app integration

## Modern PWA Features

### 1. Offline Support
- Service worker strategies
- Cache management
- Offline-first design

### 2. Performance
- Fast loading
- Smooth animations
- Responsive design

### 3. User Experience
- Native-like interactions
- Installation prompts
- App-like navigation

## Development Tools

- Lighthouse
- Workbox
- PWA Builder
- Chrome DevTools

## Best Practices

1. **Offline-First Design**
2. **Performance Optimization**
3. **User Experience Focus**
4. **Progressive Enhancement**

## Conclusion

PWAs represent the future of web applications, offering the best of both web and native app experiences.
    `,
    excerpt: "Learn how to build modern Progressive Web Apps with offline support, performance optimization, and native app-like experiences.",
    coverImage: "/pwa-guide-2024.png",
    published: true,
    featured: false,
    category: "Mobile Apps",
    tags: ["PWA", "Service Workers", "Mobile", "Web Development"],
    readTime: 11
  }
];

const sampleComments = [
  {
    content: "Great article! The Next.js 15 features look really promising. Can't wait to try them out.",
    isApproved: true,
    isSpam: false
  },
  {
    content: "This TypeScript guide is exactly what I needed. The examples are very clear and practical.",
    isApproved: true,
    isSpam: false
  },
  {
    content: "Excellent performance tips! I've already implemented some of these in my React app.",
    isApproved: true,
    isSpam: false
  },
  {
    content: "Very informative MongoDB guide. The security section was particularly helpful.",
    isApproved: true,
    isSpam: false
  }
];

const sampleContacts = [
  {
    name: "Alex Thompson",
    email: "alex@startupco.com",
    subject: "Website Redesign Project",
    message: "Hi Sufyan, we're looking to redesign our company website. Would love to discuss the project and get a quote.",
    company: "StartupCo",
    budget: "$5K-$10K",
    timeline: "1-2 months",
    source: "Website",
    status: "NEW",
    priority: "HIGH"
  },
  {
    name: "Lisa Chen",
    email: "lisa@techagency.com",
    subject: "E-commerce Platform Development",
    message: "We need a custom e-commerce solution for our client. Your portfolio shows you have experience in this area.",
    company: "TechAgency",
    budget: "$25K-$50K",
    timeline: "3+ months",
    source: "Referral",
    status: "CONTACTED",
    priority: "HIGH"
  },
  {
    name: "Mark Davis",
    email: "mark@consulting.com",
    subject: "Technical Consultation",
    message: "Looking for a technical consultant to help optimize our web application performance.",
    company: "Consulting Inc.",
    budget: "Not Sure",
    timeline: "ASAP",
    source: "Social Media",
    status: "QUALIFIED",
    priority: "MEDIUM"
  }
];

const sampleNewsletters = [
  {
    email: "john@example.com",
    firstName: "John",
    lastName: "Smith",
    source: "Website",
    isSubscribed: true
  },
  {
    email: "emma@example.com",
    firstName: "Emma",
    lastName: "Wilson",
    source: "Blog",
    isSubscribed: true
  },
  {
    email: "michael@example.com",
    firstName: "Michael",
    lastName: "Brown",
    source: "Social Media",
    isSubscribed: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Project.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Comment.deleteMany({}),
      ContactForm.deleteMany({}),
      Newsletter.deleteMany({}),
      UserActivity.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create categories
    const categories = [];
    for (const categoryData of sampleCategories) {
      const category = new Category(categoryData);
      await category.save();
      categories.push(category);
      console.log(`📂 Created category: ${category.name}`);
    }

    // Create tags
    const tags = [];
    for (const tagData of sampleTags) {
      const tag = new Tag(tagData);
      await tag.save();
      tags.push(tag);
      console.log(`🏷️ Created tag: ${tag.name}`);
    }

    // Create projects
    const projects = [];
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        author: users[0]._id // Sufyan as the author
      });
      await project.save();
      projects.push(project);
      console.log(`🚀 Created project: ${project.title}`);
    }

    // Create posts
    const posts = [];
    for (const postData of samplePosts) {
      const post = new Post({
        ...postData,
        author: users[0]._id, // Sufyan as the author
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10
      });
      await post.save();
      posts.push(post);
      console.log(`📝 Created post: ${post.title}`);
    }

    // Create comments
    for (let i = 0; i < sampleComments.length; i++) {
      const commentData = sampleComments[i];
      const comment = new Comment({
        ...commentData,
        author: users[Math.floor(Math.random() * users.length)]._id,
        post: posts[i % posts.length]._id
      });
      await comment.save();
      console.log(`💬 Created comment on: ${posts[i % posts.length].title}`);
    }

    // Create contact forms
    for (const contactData of sampleContacts) {
      const contact = new ContactForm(contactData);
      await contact.save();
      console.log(`📧 Created contact: ${contact.name}`);
    }

    // Create newsletter subscriptions
    for (const newsletterData of sampleNewsletters) {
      const newsletter = new Newsletter(newsletterData);
      await newsletter.save();
      console.log(`📰 Created newsletter: ${newsletter.email}`);
    }

    // Create user activities
    for (const user of users) {
      const activities = [
        { action: 'LOGIN', resource: 'USER', resourceId: user._id },
        { action: 'PROFILE_UPDATE', resource: 'USER', resourceId: user._id },
        { action: 'VIEW_POST', resource: 'POST', resourceId: posts[0]._id }
      ];
      
      for (const activityData of activities) {
        const activity = new UserActivity({
          ...activityData,
          user: user._id
        });
        await activity.save();
      }
      console.log(`📊 Created activities for: ${user.name}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Tags: ${tags.length}`);
    console.log(`   Projects: ${projects.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Comments: ${sampleComments.length}`);
    console.log(`   Contacts: ${sampleContacts.length}`);
    console.log(`   Newsletters: ${sampleNewsletters.length}`);
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Super Admin: sufyan@example.com / admin123');
    console.log('   Editor: sarah@example.com / editor123');
    console.log('   User: mike@example.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeder
seedDatabase();

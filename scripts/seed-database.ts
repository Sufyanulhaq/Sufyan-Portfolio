import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models (we'll need to compile these first)
import User from '../models/User';
import Post from '../models/Post';
import Project from '../models/Project';
import Category from '../models/Category';
import Tag from '../models/Tag';
import Comment from '../models/Comment';
import ContactForm from '../models/ContactForm';
import Newsletter from '../models/Newsletter';
import UserActivity from '../models/UserActivity';

// Sample data
const sampleUsers = [
  {
    name: "Sufyan Ul Haq",
    email: "sufyan@example.com",
    password: "admin123",
    role: "SUPER_ADMIN",
    website: "https://sufyanulhaq.com",
    github: "https://github.com/sufyanulhaq",
    linkedin: "https://linkedin.com/in/sufyanulhaq",
    twitter: "https://twitter.com/sufyanulhaq",
    isActive: true,
    isEmailVerified: true,
    bio: "Full-stack developer passionate about creating amazing web experiences"
  },
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "editor123",
    role: "EDITOR",
    isActive: true,
    isEmailVerified: true,
    bio: "Content editor and tech enthusiast"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "user123",
    role: "USER",
    isActive: true,
    isEmailVerified: true,
    bio: "Web developer and designer"
  }
];

const sampleCategories = [
  { name: "Web Development", slug: "web-development", description: "Full-stack web development projects", color: "#0ea5e9", isActive: true },
  { name: "Mobile Apps", slug: "mobile-apps", description: "Mobile application development", color: "#8b5cf6", isActive: true },
  { name: "UI/UX Design", slug: "ui-ux-design", description: "User interface and experience design", color: "#10b981", isActive: true },
  { name: "E-commerce", slug: "e-commerce", description: "Online shopping platforms", color: "#f59e0b", isActive: true },
  { name: "API Development", slug: "api-development", description: "Backend API services", color: "#ef4444", isActive: true },
  { name: "Performance", slug: "performance", description: "Performance optimization projects", color: "#06b6d4", isActive: true }
];

const sampleTags = [
  { name: "React", slug: "react", color: "#61dafb" },
  { name: "Next.js", slug: "nextjs", color: "#000000" },
  { name: "TypeScript", slug: "typescript", color: "#3178c6" },
  { name: "Node.js", slug: "nodejs", color: "#339933" },
  { name: "MongoDB", slug: "mongodb", color: "#47a248" },
  { name: "Tailwind CSS", slug: "tailwind-css", color: "#06b6d4" },
  { name: "Framer Motion", slug: "framer-motion", color: "#0055ff" },
  { name: "Vercel", slug: "vercel", color: "#000000" }
];

const sampleProjects = [
  {
    title: "Modern E-commerce Platform",
    slug: "modern-ecommerce-platform",
    description: "A full-stack e-commerce solution with modern UI/UX",
    longDescription: "Built with Next.js, TypeScript, and MongoDB. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS"],
    category: "E-commerce",
    featured: true,
    liveUrl: "https://demo-ecommerce.vercel.app",
    githubUrl: "https://github.com/sufyanulhaq/ecommerce-platform",
    status: "COMPLETED",
    startDate: "2024-01-15",
    endDate: "2024-03-20",
    client: "TechCorp Inc.",
    coverImage: "/modern-ecommerce-dashboard.png"
  },
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    description: "Personal portfolio showcasing my work and skills",
    longDescription: "A modern, responsive portfolio website built with Next.js 15, featuring blog functionality, project showcase, and admin dashboard.",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "MongoDB"],
    category: "Web Development",
    featured: true,
    liveUrl: "https://sufyanulhaq.com",
    githubUrl: "https://github.com/sufyanulhaq/portfolio",
    status: "COMPLETED",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    coverImage: "/modern-portfolio-website.png"
  },
  {
    title: "Task Management App",
    slug: "task-management-app",
    description: "Collaborative task management application",
    longDescription: "A real-time task management app with team collaboration, real-time updates, and advanced project tracking features.",
    technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "Material-UI"],
    category: "Web Development",
    featured: false,
    liveUrl: "https://task-app.vercel.app",
    githubUrl: "https://github.com/sufyanulhaq/task-app",
    status: "COMPLETED",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    client: "StartupXYZ",
    coverImage: "/task-management-app.png"
  }
];

const samplePosts = [
  {
    title: "Building Modern Web Applications with Next.js 15",
    slug: "building-modern-web-applications-with-nextjs-15",
    excerpt: "Explore the latest features in Next.js 15 and how they revolutionize web development",
    content: `
      <h2>Introduction</h2>
      <p>Next.js 15 brings exciting new features that make building modern web applications faster and more efficient than ever before.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Improved App Router</li>
        <li>Better TypeScript support</li>
        <li>Enhanced performance</li>
        <li>New developer experience</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To get started with Next.js 15, simply run:</p>
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre>
      
      <h2>Conclusion</h2>
      <p>Next.js 15 is a game-changer for modern web development. The new features and improvements make it the go-to framework for building production-ready applications.</p>
    `,
    category: "Web Development",
    tags: ["Next.js", "React", "TypeScript", "Web Development"],
    coverImage: "/placeholder.jpg",
    readTime: 8,
    published: true,
    featured: true
  },
  {
    title: "The Future of TypeScript in 2024",
    slug: "the-future-of-typescript-in-2024",
    excerpt: "Discover what's new and exciting in the TypeScript ecosystem",
    content: `
      <h2>TypeScript Evolution</h2>
      <p>TypeScript continues to evolve with new features that make development more productive and type-safe.</p>
      
      <h2>New Features</h2>
      <ul>
        <li>Improved inference</li>
        <li>Better error messages</li>
        <li>Performance improvements</li>
        <li>Enhanced tooling</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Adopting TypeScript best practices can significantly improve your code quality and developer experience.</p>
    `,
    category: "Web Development",
    tags: ["TypeScript", "JavaScript", "Programming"],
    coverImage: "/placeholder.jpg",
    readTime: 6,
    published: true,
    featured: false
  }
];

const sampleComments = [
  {
    content: "Great article! The Next.js 15 features look really promising.",
    isApproved: true
  },
  {
    content: "Thanks for sharing these insights. Very helpful for my current project.",
    isApproved: true
  },
  {
    content: "Looking forward to trying out these new features.",
    isApproved: false
  }
];

const sampleContacts = [
  {
    name: "John Smith",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "Hi Sufyan, I'm interested in discussing a potential web development project. Could we schedule a call?",
    phone: "+1-555-0123",
    company: "Digital Solutions Inc.",
    website: "https://digitalsolutions.com",
    budget: "$10K-$25K",
    timeline: "3+ months",
    source: "Website"
  },
  {
    name: "Emily Davis",
    email: "emily@example.com",
    subject: "Freelance Opportunity",
    message: "Hello! I'm looking for a developer to help with a React project. Are you available for freelance work?",
    company: "StartupXYZ",
    budget: "$5K-$10K",
    timeline: "1-2 months",
    source: "Social Media"
  }
];

const sampleNewsletters = [
  {
    email: "developer@example.com",
    firstName: "Alex",
    lastName: "Developer",
    source: "Website"
  },
  {
    email: "designer@example.com",
    firstName: "Sarah",
    lastName: "Designer",
    source: "Blog"
  }
];

const sampleActivities = [
  {
    action: "PAGE_VIEW",
    resource: "homepage",
    details: { page: "/", timestamp: new Date() }
  },
  {
    action: "PAGE_VIEW",
    resource: "portfolio",
    details: { page: "/portfolio", timestamp: new Date() }
  },
  {
    action: "PAGE_VIEW",
    resource: "blog",
    details: { page: "/blog", timestamp: new Date() }
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
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

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create tags
    const createdTags = await Tag.insertMany(sampleTags);
    console.log(`✅ Created ${createdTags.length} tags`);

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create projects
    const createdProjects = [];
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        author: createdUsers[0]._id // Assign to first user
      });
      await project.save();
      createdProjects.push(project);
    }
    console.log(`✅ Created ${createdProjects.length} projects`);

    // Create posts
    const createdPosts = [];
    for (const postData of samplePosts) {
      const post = new Post({
        ...postData,
        author: createdUsers[0]._id // Assign to first user
      });
      await post.save();
      createdPosts.push(post);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Create comments
    const createdComments = [];
    for (let i = 0; i < sampleComments.length; i++) {
      const comment = new Comment({
        ...sampleComments[i],
        post: createdPosts[i % createdPosts.length]._id,
        author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id
      });
      await comment.save();
      createdComments.push(comment);
    }
    console.log(`✅ Created ${createdComments.length} comments`);

    // Create contact forms
    const createdContacts = await ContactForm.insertMany(sampleContacts);
    console.log(`✅ Created ${createdContacts.length} contact forms`);

    // Create newsletter subscriptions
    const createdNewsletters = await Newsletter.insertMany(sampleNewsletters);
    console.log(`✅ Created ${createdNewsletters.length} newsletter subscriptions`);

    // Create user activities
    const createdActivities = [];
    for (const activityData of sampleActivities) {
      const activity = new UserActivity({
        ...activityData,
        user: createdUsers[0]._id // Assign to first user
      });
      await activity.save();
      createdActivities.push(activity);
    }
    console.log(`✅ Created ${createdActivities.length} user activities`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📝 Posts: ${createdPosts.length}`);
    console.log(`   🚀 Projects: ${createdProjects.length}`);
    console.log(`   🏷️ Categories: ${createdCategories.length}`);
    console.log(`   🏷️ Tags: ${createdTags.length}`);
    console.log(`   💬 Comments: ${createdComments.length}`);
    console.log(`   📧 Contact Forms: ${createdContacts.length}`);
    console.log(`   📬 Newsletter Subscriptions: ${createdNewsletters.length}`);
    console.log(`   📊 User Activities: ${createdActivities.length}`);

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

seedDatabase();

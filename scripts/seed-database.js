const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Project = require("../models/Project")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const MONGODB_URI =
  "mongodb+srv://sufyanchester:sufyanulhaq@cluster0.mzeyo4a.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0"

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await mongoose.connection.db.dropDatabase()
    console.log("Database cleared")

    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = await User.create({
      name: "Sufyan Ul Haq",
      email: "sufyan@example.com",
      password: hashedPassword,
      role: "ADMIN",
      bio: "Full-stack developer passionate about creating innovative web solutions.",
      website: "https://sufyan.dev",
      github: "https://github.com/sufyan",
      linkedin: "https://linkedin.com/in/sufyan",
      twitter: "https://twitter.com/sufyan",
    })

    console.log("Admin user created:", adminUser.email)

    // Create sample projects
    const sampleProjects = [
      {
        title: "E-commerce Dashboard",
        slug: "ecommerce-dashboard",
        description: "Modern admin dashboard for e-commerce management",
        longDescription: "A comprehensive admin dashboard built with Next.js and TypeScript...",
        coverImage: "/modern-ecommerce-dashboard.png",
        images: ["/modern-ecommerce-dashboard.png"],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
        category: "Web Application",
        featured: true,
        liveUrl: "https://ecommerce-dashboard.demo",
        githubUrl: "https://github.com/sufyan/ecommerce-dashboard",
        status: "COMPLETED",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-01"),
        client: "TechCorp Inc.",
      },
      {
        title: "Task Management App",
        slug: "task-management-app",
        description: "Collaborative task management with real-time updates",
        longDescription: "A full-stack task management application with real-time collaboration...",
        coverImage: "/task-management-app.png",
        images: ["/task-management-app.png"],
        technologies: ["React", "Node.js", "Socket.io", "PostgreSQL"],
        category: "Web Application",
        featured: true,
        liveUrl: "https://taskmanager.demo",
        githubUrl: "https://github.com/sufyan/task-manager",
        status: "COMPLETED",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-04-01"),
      },
    ]

    await Project.insertMany(sampleProjects)
    console.log("Sample projects created")

    // Create sample blog posts
    const samplePosts = [
      {
        title: "Building Modern Web Applications with Next.js",
        slug: "building-modern-web-applications-nextjs",
        content:
          "Next.js has revolutionized the way we build React applications. With features like server-side rendering, static site generation, and API routes, it provides everything you need to build production-ready applications. In this comprehensive guide, we'll explore the key features that make Next.js the go-to framework for modern web development.",
        excerpt:
          "Learn how Next.js can help you build faster, more efficient web applications with server-side rendering and static generation.",
        featuredImage: "/blog-nextjs.jpg",
        status: "PUBLISHED",
        featured: true,
        author: adminUser._id,
        tags: ["Next.js", "React", "JavaScript", "Web Development"],
        views: 1250,
      },
      {
        title: "The Future of TypeScript in 2024",
        slug: "future-of-typescript-2024",
        content:
          "TypeScript continues to evolve and improve developer experience with each release. The latest updates bring enhanced type inference, better performance, and new language features that make writing type-safe code more intuitive than ever. Let's explore what's new and what's coming next in the TypeScript ecosystem.",
        excerpt: "Exploring the latest TypeScript features and what's coming next in 2024.",
        featuredImage: "/blog-typescript.jpg",
        status: "PUBLISHED",
        featured: false,
        author: adminUser._id,
        tags: ["TypeScript", "JavaScript", "Development", "Programming"],
        views: 890,
      },
      {
        title: "Mastering React Server Components",
        slug: "mastering-react-server-components",
        content:
          "React Server Components represent a paradigm shift in how we think about React applications. By allowing components to run on the server, we can reduce bundle sizes, improve performance, and create more efficient data fetching patterns.",
        excerpt: "Deep dive into React Server Components and how they're changing the way we build React applications.",
        featuredImage: "/blog-react-server.jpg",
        status: "PUBLISHED",
        featured: true,
        author: adminUser._id,
        tags: ["React", "Server Components", "Performance", "Next.js"],
        views: 2100,
      },
    ]

    await Post.insertMany(samplePosts)
    console.log("Sample blog posts created")

    const sampleComments = [
      {
        content: "Great article! This really helped me understand Next.js better.",
        author: "John Developer",
        email: "john@example.com",
        post: samplePosts[0]._id,
        approved: true,
      },
      {
        content: "Looking forward to trying out these TypeScript features in my next project.",
        author: "Sarah Smith",
        email: "sarah@example.com",
        post: samplePosts[1]._id,
        approved: true,
      },
    ]

    await Comment.insertMany(sampleComments)
    console.log("Sample comments created")

    console.log("Database seeded successfully!")
    console.log("Admin credentials: sufyan@example.com / admin123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.connection.close()
  }
}

seedDatabase()

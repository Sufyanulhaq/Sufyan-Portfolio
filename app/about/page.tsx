import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  Palette, 
  Zap, 
  Users, 
  Target, 
  Award, 
  Clock, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Shield,
  Heart
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  const skills = [
    {
      category: "Frontend Development",
      icon: Code,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "PWA"],
      description: "Building modern, responsive user interfaces with cutting-edge technologies"
    },
    {
      category: "Backend Development",
      icon: Zap,
      skills: ["Node.js", "Express", "GraphQL", "REST APIs", "Microservices", "Docker"],
      description: "Creating robust, scalable server-side solutions and APIs"
    },
    {
      category: "Database & Cloud",
      icon: Globe,
      skills: ["PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel", "CloudFlare"],
      description: "Designing efficient data architectures and cloud-native solutions"
    },
    {
      category: "Design & UX",
      icon: Palette,
      skills: ["UI/UX Design", "Figma", "Responsive Design", "Accessibility", "Design Systems"],
      description: "Creating beautiful, intuitive user experiences that convert"
    }
  ]

  const experience = [
    {
      period: "2023 - Present",
      role: "Senior Full-Stack Developer",
      company: "Freelance & Agency Work",
      description: "Leading development teams and delivering complex web applications for clients across various industries. Specializing in performance optimization and scalable architecture.",
      achievements: [
        "Delivered 50+ high-impact projects",
        "Improved client conversion rates by 300%",
        "Reduced page load times by 60%",
        "Mentored 15+ junior developers"
      ]
    },
    {
      period: "2021 - 2023",
      role: "Full-Stack Developer",
      company: "Tech Solutions Inc.",
      description: "Developed and maintained web applications for enterprise clients, focusing on e-commerce platforms and business intelligence dashboards.",
      achievements: [
        "Built 3 major e-commerce platforms",
        "Implemented CI/CD pipelines",
        "Optimized database performance",
        "Led agile development teams"
      ]
    },
    {
      period: "2019 - 2021",
      role: "Frontend Developer",
      company: "Digital Agency",
      description: "Specialized in creating responsive, user-friendly interfaces and implementing modern frontend technologies.",
      achievements: [
        "Created 20+ responsive websites",
        "Improved user engagement by 45%",
        "Implemented PWA features",
        "Optimized Core Web Vitals"
      ]
    }
  ]

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "Every project is measured by its impact on business goals and user satisfaction. I don't just build websites—I build solutions that drive growth."
    },
    {
      icon: Shield,
      title: "Quality First",
      description: "I maintain the highest standards of code quality, performance, and security. Your project is built to last and scale with your business."
    },
    {
      icon: Users,
      title: "Client Partnership",
      description: "I work closely with you throughout the entire process, ensuring transparency, communication, and alignment with your vision and goals."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "I stay current with the latest technologies and industry trends, bringing innovative solutions that give you a competitive advantage."
    }
  ]

  const stats = [
    { number: "50+", label: "Projects Delivered", icon: CheckCircle },
    { number: "99.9%", label: "Client Satisfaction", icon: Star },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "300%", label: "Average ROI", icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                Full-Stack Developer & Digital Strategist
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Building Digital
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Excellence
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                I'm a passionate full-stack developer with over 5 years of experience creating 
                exceptional digital experiences. I specialize in modern web technologies, 
                performance optimization, and delivering solutions that drive real business results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="hero" className="text-lg">
                  <Link href="/portfolio">
                    View My Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="hero" className="text-lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden mx-auto shadow-2xl">
                <img 
                  src="/images/backgrounds/professional-portrait.jpg" 
                  alt="Sufyan Ul Haq - Full-Stack Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                  Available for Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              My Journey in Web Development
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From my first "Hello World" to building complex enterprise applications, 
              here's how I've grown and what drives me to keep pushing boundaries.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  My journey in web development began with a simple curiosity about how websites work. 
                  What started as a hobby quickly evolved into a passion for creating digital experiences 
                  that not only look great but also solve real problems and drive business growth.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Over the years, I've worked with clients across various industries—from startups 
                  looking to establish their digital presence to established companies seeking to 
                  modernize their platforms. Each project has taught me something new and reinforced 
                  my belief that great web development is about more than just code—it's about 
                  understanding business objectives, user needs, and creating solutions that exceed expectations.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, I specialize in building high-performance, scalable web applications using 
                  modern technologies like React, Next.js, and Node.js. I'm passionate about 
                  performance optimization, user experience design, and staying current with the 
                  latest industry trends and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/tech-pattern.svg')] bg-repeat opacity-5"></div>
        {/* Professional Development Workspace Background */}
        <div className="absolute inset-0 bg-[url('/images/backgrounds/technical-expertise-bg.jpg')] bg-cover bg-center opacity-10"></div>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Technical Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive skill set that covers every aspect of modern web development, 
              from frontend frameworks to cloud infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <skillGroup.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{skillGroup.category}</h3>
                <p className="text-muted-foreground text-center mb-6">{skillGroup.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skillGroup.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Professional Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven track record of delivering exceptional results across various roles 
              and industries, with a focus on growth and continuous learning.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {experience.map((exp, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <div className="space-y-3">
                      <Badge variant="secondary" className="text-sm">
                        {exp.period}
                      </Badge>
                      <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Drives Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The core principles that guide my work and ensure every project 
              delivers exceptional results and exceeds expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What I'm Working On */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What I'm Working On
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Current projects, learning goals, and the technologies I'm exploring 
              to stay at the forefront of web development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Integration</h3>
              <p className="text-muted-foreground">
                Exploring AI-powered features and tools to enhance user experiences 
                and automate development workflows.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance Optimization</h3>
              <p className="text-muted-foreground">
                Researching advanced techniques for building lightning-fast websites 
                and improving Core Web Vitals scores.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Web3 & Blockchain</h3>
              <p className="text-muted-foreground">
                Learning about decentralized applications and blockchain technologies 
                to understand the future of web development.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and see how I can help bring your vision to life. 
            I'm excited to learn about your goals and create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="hero" variant="secondary" className="text-lg">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="hero" variant="outline" className="text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/portfolio">View My Work</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

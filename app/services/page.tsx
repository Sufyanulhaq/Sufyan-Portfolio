import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code, Palette, Smartphone, Globe, Database, Zap, ArrowRight, Check, Clock, Users, Target, BarChart3, Shield, Zap as ZapIcon } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "End-to-end web application development using cutting-edge technologies and best practices.",
      features: [
        "Custom Web Applications",
        "API Development & Integration",
        "Database Design & Optimization",
        "Performance Optimization",
        "Security Implementation",
        "Testing & Quality Assurance"
      ],
      techStack: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB"],
      price: "Starting at $8,000",
      timeline: "6-12 weeks",
      category: "Development"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating beautiful, intuitive user interfaces that provide exceptional user experiences and drive conversions.",
      features: [
        "User Interface Design",
        "User Experience Research",
        "Wireframing & Prototyping",
        "Design Systems",
        "Responsive Design",
        "Accessibility Compliance"
      ],
      techStack: ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Principle"],
      price: "Starting at $3,500",
      timeline: "3-6 weeks",
      category: "Design"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Development",
      description: "Responsive web applications and progressive web apps that work seamlessly across all devices.",
      features: [
        "Responsive Web Design",
        "Progressive Web Apps (PWA)",
        "Mobile Optimization",
        "Cross-platform Solutions",
        "Touch-friendly Interfaces",
        "Performance Optimization"
      ],
      techStack: ["React Native", "Next.js", "PWA", "Mobile-first CSS", "Touch Events"],
      price: "Starting at $5,500",
      timeline: "4-8 weeks",
      category: "Development"
    },
    {
      icon: Globe,
      title: "Website Development",
      description: "Professional websites for businesses, portfolios, and e-commerce platforms that convert visitors into customers.",
      features: [
        "Business Websites",
        "E-commerce Platforms",
        "Portfolio Sites",
        "Landing Pages",
        "Content Management",
        "SEO Optimization"
      ],
      techStack: ["Next.js", "WordPress", "Shopify", "Stripe", "Contentful"],
      price: "Starting at $4,000",
      timeline: "3-6 weeks",
      category: "Development"
    },
    {
      icon: Database,
      title: "Backend & API Development",
      description: "Robust server-side solutions, APIs, and database architecture for scalable applications.",
      features: [
        "RESTful APIs",
        "GraphQL APIs",
        "Database Architecture",
        "Server Configuration",
        "Third-party Integrations",
        "Microservices"
      ],
      techStack: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis", "Docker"],
      price: "Starting at $6,000",
      timeline: "5-10 weeks",
      category: "Development"
    },
    {
      icon: Zap,
      title: "Performance & SEO",
      description: "Improving website speed, search engine optimization, and overall performance for better user experience and rankings.",
      features: [
        "Speed Optimization",
        "SEO Implementation",
        "Core Web Vitals",
        "Code Refactoring",
        "Performance Monitoring",
        "Analytics Setup"
      ],
      techStack: ["Lighthouse", "Google Analytics", "Search Console", "WebPageTest", "GTmetrix"],
      price: "Starting at $2,500",
      timeline: "2-4 weeks",
      category: "Optimization"
    }
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We start by understanding your business goals, target audience, and technical requirements to create a comprehensive project roadmap.",
      icon: Target,
      duration: "1-2 weeks"
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "Creating wireframes, mockups, and interactive prototypes to visualize the final product before development begins.",
      icon: Palette,
      duration: "2-4 weeks"
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Building your application with clean, maintainable code while conducting thorough testing throughout the development process.",
      icon: Code,
      duration: "4-12 weeks"
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Deploying your project and providing ongoing support, maintenance, and updates to ensure long-term success.",
      icon: ZapIcon,
      duration: "Ongoing"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      content: "Sufyan transformed our outdated website into a modern, high-performing platform that increased our conversion rate by 300%.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, Digital Ventures",
      content: "Working with Sufyan was exceptional. He delivered our e-commerce platform on time and exceeded all expectations.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Marketing Director, Growth Co.",
      content: "The performance optimization work Sufyan did improved our page load times from 8 seconds to under 2 seconds.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-heading font-bold text-xl text-foreground">
              Sufyan
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link href="/services" className="text-foreground font-medium">
                Services
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Professional Web Development
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Services
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              From concept to deployment, I deliver high-quality web solutions that drive business growth, 
              enhance user experience, and establish your digital presence in the competitive online landscape.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                <Link href="/portfolio">View My Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Development Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I offer a full spectrum of web development services to meet your business needs and exceed your expectations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Key Features
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4 text-blue-500" />
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.techStack.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Starting Price:</span>
                            <span className="font-semibold text-foreground">{service.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span className="font-semibold text-foreground">{service.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              My Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven methodology that ensures quality, transparency, and on-time delivery for every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-1/2" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    <Clock className="h-4 w-4" />
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Me for Your Project?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I bring a unique combination of technical expertise, creative vision, and business understanding to every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Client-Focused Approach</h3>
              <p className="text-muted-foreground">
                Every project is built around your specific needs, goals, and vision. I work closely with you to ensure the final product exceeds expectations.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality & Reliability</h3>
              <p className="text-muted-foreground">
                I maintain the highest standards of code quality, performance, and security. Your project is built to last and scale with your business.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Results-Driven</h3>
              <p className="text-muted-foreground">
                I don't just build websites - I build digital solutions that drive business growth, improve user experience, and deliver measurable results.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What My Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it - hear from the businesses I've helped transform and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Check key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your vision and turn it into a powerful digital solution that drives results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/portfolio">
                View My Work
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

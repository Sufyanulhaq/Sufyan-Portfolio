import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  Palette, 
  Zap, 
  Globe, 
  ShoppingCart, 
  BarChart3, 
  Smartphone, 
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Target,
  Star,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ServicesPage() {
  const services = [
    {
      title: "Website Development",
      description: "Custom websites built with modern technologies and best practices for optimal performance and user experience.",
      longDescription: "From simple landing pages to complex web applications, I create websites that not only look stunning but also drive results. Every website is built with SEO in mind, mobile-first responsive design, and performance optimization.",
      icon: Globe,
      image: "/images/services/web-development-service.jpg",
      category: "Development",
      price: "£2,500 - £15,000",
      timeline: "2-8 weeks",
      techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      features: [
        "Responsive design for all devices",
        "SEO optimization and performance",
        "Content management system",
        "Analytics and tracking setup",
        "Ongoing support and maintenance"
      ],
      benefits: [
        "Professional online presence",
        "Improved brand credibility",
        "Better user engagement",
        "Higher conversion rates"
      ]
    },
    {
      title: "E-commerce Solutions",
      description: "Complete online stores with payment processing, inventory management, and customer analytics.",
      longDescription: "Transform your business with a powerful e-commerce platform that handles everything from product management to order fulfillment. Built with security and scalability in mind to grow with your business.",
      icon: ShoppingCart,
      image: "/images/services/ecommerce-service.jpg",
      category: "E-commerce",
      price: "£8,000 - £25,000",
      timeline: "6-12 weeks",
      techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "AWS"],
      features: [
        "Secure payment processing",
        "Inventory management system",
        "Customer account management",
        "Order tracking and notifications",
        "Analytics and reporting dashboard"
      ],
      benefits: [
        "24/7 online sales capability",
        "Reduced operational costs",
        "Expanded customer reach",
        "Automated order processing"
      ]
    },
    {
      title: "Web Applications",
      description: "Custom business applications and dashboards that streamline operations and improve productivity.",
      longDescription: "Build powerful web applications that solve specific business problems. From internal tools to customer-facing platforms, I create applications that integrate seamlessly with your existing workflow.",
      icon: Code,
      image: "/images/services/web-apps-service.jpg",
      category: "Development",
      price: "£15,000 - £50,000",
      timeline: "8-20 weeks",
      techStack: ["React", "Node.js", "GraphQL", "MongoDB", "Docker"],
      features: [
        "Custom feature development",
        "API integration and development",
        "User authentication and roles",
        "Real-time data updates",
        "Comprehensive testing and deployment"
      ],
      benefits: [
        "Streamlined business processes",
        "Improved team productivity",
        "Better data insights",
        "Competitive advantage"
      ]
    },
    {
      title: "UI/UX Design",
      description: "Beautiful, intuitive user interfaces designed to convert visitors into customers.",
      longDescription: "Create compelling user experiences that guide visitors through your website and encourage them to take action. Every design decision is backed by user research and conversion optimization principles.",
      icon: Palette,
      image: "/images/services/ui-ux-service.jpg",
      category: "Design",
      price: "£3,000 - £12,000",
      timeline: "3-6 weeks",
      techStack: ["Figma", "Adobe Creative Suite", "Prototyping tools", "User research"],
      features: [
        "User research and persona development",
        "Wireframing and prototyping",
        "Visual design and branding",
        "User testing and iteration",
        "Design system creation"
      ],
      benefits: [
        "Improved user satisfaction",
        "Higher conversion rates",
        "Reduced user errors",
        "Better brand perception"
      ]
    },
    {
      title: "Performance Optimization",
      description: "Speed up your existing website and improve Core Web Vitals scores for better SEO and user experience.",
      longDescription: "Transform slow websites into lightning-fast experiences that users love and search engines reward. I analyze your current performance and implement targeted optimizations for maximum impact.",
      icon: Zap,
      image: "/images/services/performance-service.jpg",
      category: "Optimization",
      price: "£1,500 - £8,000",
      timeline: "1-4 weeks",
      techStack: ["Lighthouse", "WebPageTest", "Core Web Vitals", "CDN optimization"],
      features: [
        "Performance audit and analysis",
        "Image and asset optimization",
        "Code splitting and bundling",
        "Caching strategy implementation",
        "Ongoing performance monitoring"
      ],
      benefits: [
        "Faster page load times",
        "Better search engine rankings",
        "Improved user engagement",
        "Reduced bounce rates"
      ]
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that provide seamless user experiences.",
      longDescription: "Extend your digital presence to mobile devices with apps that work flawlessly across iOS and Android. Built with modern frameworks for optimal performance and user experience.",
      icon: Smartphone,
      image: "/images/services/mobile-apps-service.jpg",
      category: "Development",
      price: "£12,000 - £40,000",
      timeline: "10-16 weeks",
      techStack: ["React Native", "Flutter", "Native iOS/Android", "Firebase"],
      features: [
        "Cross-platform compatibility",
        "Native performance optimization",
        "Push notifications",
        "Offline functionality",
        "App store deployment"
      ],
      benefits: [
        "Mobile-first user experience",
        "Increased customer engagement",
        "New revenue opportunities",
        "Competitive mobile presence"
      ]
    }
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We start by understanding your business goals, target audience, and project requirements. This phase includes research, competitor analysis, and creating a comprehensive project roadmap.",
      duration: "1-2 weeks",
      icon: Target
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "I create wireframes, mockups, and interactive prototypes to visualize your project. We iterate on designs based on your feedback until we achieve the perfect solution.",
      duration: "2-4 weeks",
      icon: Palette
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Your project is built with clean, maintainable code while conducting thorough testing throughout. Regular updates keep you informed of progress and allow for feedback.",
      duration: "4-16 weeks",
      icon: Code
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Your project goes live with comprehensive testing and quality assurance. I provide ongoing support, maintenance, and updates to ensure long-term success.",
      duration: "Ongoing",
      icon: Star
    }
  ]

  const whyChooseMe = [
    {
      icon: Users,
      title: "Client-Focused Approach",
      description: "I work closely with you throughout the entire process, ensuring your vision is realized and your business goals are met."
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Track record of delivering projects that exceed expectations and drive measurable business results for clients."
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Committed to meeting deadlines and delivering your project when promised, without compromising on quality."
    },
    {
      icon: CheckCircle,
      title: "Ongoing Support",
      description: "Long-term partnership with ongoing support, maintenance, and updates to ensure your project continues to perform."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      content: "Sufyan delivered an exceptional e-commerce platform that exceeded our expectations. Our online sales increased by 300% within the first month!",
      rating: 5,
      service: "E-commerce Development"
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, Digital Ventures",
      content: "The performance optimization work Sufyan did transformed our website from slow to lightning-fast. Our bounce rate dropped by 40%!",
      rating: 5,
      service: "Performance Optimization"
    },
    {
      name: "Emily Watson",
      role: "Marketing Director, Growth Co.",
      content: "Working with Sufyan was a game-changer. He built a custom dashboard that gives us insights we never had before.",
      rating: 5,
      service: "Web Application Development"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Web Services
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive web development solutions designed to transform your digital presence 
              and drive real business results. From concept to deployment, I handle every aspect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="hero" className="text-lg">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="hero" className="text-lg">
                <Link href="/portfolio">View My Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What I Offer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive range of web development services tailored to meet your specific needs 
              and business objectives.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Service Image */}
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  <img 
                    src={service.image || "/placeholder.svg"} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.longDescription}</p>
                  
                  {/* Tech Stack */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.techStack.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Investment:</span>
                      <div className="font-semibold text-foreground">{service.price}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Timeline:</span>
                      <div className="font-semibold text-foreground">{service.timeline}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-2">Business Benefits:</h4>
                    <ul className="space-y-1">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild size="cta" className="w-full">
                    <Link href="/contact">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/process-pattern.svg')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven methodology that ensures quality, transparency, and on-time delivery 
              for every project.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                <Badge variant="outline">{step.duration}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/tech-pattern.svg')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Why Choose Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What sets me apart from other developers and ensures your project's success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseMe.map((reason, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <reason.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-red-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/tech-pattern.svg')] bg-repeat opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Client Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it - hear from the businesses I've helped 
              transform through exceptional web development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.service}
                  </Badge>
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
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and see how I can help bring your vision to life. 
            I'm excited to create something amazing together.
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

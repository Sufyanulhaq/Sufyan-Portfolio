import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code, Palette, Smartphone, Globe, Database, Zap, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Code,
      title: "Full-Stack Development",
      description:
        "End-to-end web application development using modern technologies like React, Node.js, and TypeScript.",
      features: ["Custom Web Applications", "API Development", "Database Design", "Performance Optimization"],
      price: "Starting at $5,000",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Creating beautiful, intuitive user interfaces that provide exceptional user experiences.",
      features: ["User Interface Design", "User Experience Research", "Prototyping", "Design Systems"],
      price: "Starting at $2,500",
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Responsive web applications and mobile-first designs that work seamlessly across all devices.",
      features: ["Responsive Design", "Mobile Optimization", "Progressive Web Apps", "Cross-platform Solutions"],
      price: "Starting at $4,000",
    },
    {
      icon: Globe,
      title: "Website Development",
      description: "Professional websites for businesses, portfolios, and e-commerce platforms.",
      features: ["Business Websites", "E-commerce Platforms", "Portfolio Sites", "Landing Pages"],
      price: "Starting at $3,000",
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Robust server-side solutions, APIs, and database architecture for scalable applications.",
      features: ["RESTful APIs", "Database Architecture", "Server Configuration", "Third-party Integrations"],
      price: "Starting at $4,500",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Improving website speed, SEO, and overall performance for better user experience.",
      features: ["Speed Optimization", "SEO Implementation", "Code Refactoring", "Performance Monitoring"],
      price: "Starting at $2,000",
    },
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description:
        "We start by understanding your goals, requirements, and target audience to create a comprehensive project plan.",
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description:
        "Creating wireframes, mockups, and prototypes to visualize the final product before development begins.",
    },
    {
      step: "03",
      title: "Development & Testing",
      description:
        "Building your application with clean, maintainable code while conducting thorough testing throughout the process.",
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Deploying your project and providing ongoing support, maintenance, and updates as needed.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link href="/services" className="text-foreground font-medium">
                Services
              </Link>
              <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </a>
              <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Services Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-6">Services I Offer</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From concept to deployment, I provide comprehensive web development services to bring your ideas to life
              with modern technologies and best practices.
            </p>
          </div>

          {/* Services Grid */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card key={index} className="p-6 bg-card border-border hover:shadow-lg transition-shadow group">
                    <div className="mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-card-foreground mb-2">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm font-medium">
                        {service.price}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>

          {/* Process Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">My Development Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A structured approach to ensure your project is delivered on time, within budget, and exceeds
                expectations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-heading font-bold text-primary">{step.step}</span>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-border">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Ready to Start Your Project?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let's discuss your ideas and create something amazing together. I'm here to help bring your vision to
                life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Portfolio
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

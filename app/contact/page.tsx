"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Globe,
  Send,
  Calendar,
  Target,
  Github,
  Linkedin,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "New Project Inquiry",
    message: "",
    phone: "",
    website: "",
    budget: "",
    timeline: "",
    source: "Website"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "New Project Inquiry",
          message: "",
          phone: "",
          website: "",
          budget: "",
          timeline: "",
          source: "Website"
        })
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@sufyanulhaq.com",
      description: "Send me a message anytime",
      link: "mailto:hello@sufyanulhaq.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+44 746 975 3723",
      description: "Available during business hours",
      link: "tel:+447469753723"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Liverpool, UK",
      description: "Serving clients worldwide"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      description: "Quick turnaround guaranteed"
    }
  ]

  const socialLinks = [
    {
      icon: Github,
      title: "GitHub",
      value: "@Sufyanulhaq",
      description: "View my code and projects",
      link: "https://github.com/Sufyanulhaq"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "sufyanulhaq",
      description: "Connect professionally",
      link: "https://www.linkedin.com/in/sufyanulhaq/"
    },
    {
      icon: ExternalLink,
      title: "Fiverr",
      value: "nexgendev",
      description: "Hire me on Fiverr",
      link: "https://www.fiverr.com/sellers/nexgendev_"
    },
    {
      icon: ExternalLink,
      title: "Upwork",
      value: "sufyanulhaq",
      description: "Hire me on Upwork",
      link: "https://www.upwork.com/freelancers/~013b81e78082f94d09"
    }
  ]

  const projectTypes = [
    {
      title: "Website Development",
      description: "Custom websites, landing pages, and web applications",
      icon: Globe,
      features: ["Responsive Design", "SEO Optimization", "Performance Focused"]
    },
    {
      title: "E-commerce Solutions",
      description: "Online stores and shopping platforms",
      icon: Users,
      features: ["Payment Integration", "Inventory Management", "Mobile Optimized"]
    },
    {
      title: "Web Applications",
      description: "Complex business applications and dashboards",
      icon: Zap,
      features: ["Custom Features", "API Development", "Scalable Architecture"]
    }
  ]

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We discuss your project requirements, goals, and timeline to understand your vision."
    },
    {
      step: "02",
      title: "Proposal & Planning",
      description: "I provide a detailed proposal with project scope, timeline, and investment required."
    },
    {
      step: "03",
      title: "Development & Design",
      description: "Your project is built with regular updates and collaboration throughout the process."
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Your project goes live with ongoing support and maintenance as needed."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      content: "Working with Sufyan was exceptional. He delivered our website on time and exceeded all expectations. The results speak for themselves - our conversion rate increased by 300%!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, Digital Ventures",
      content: "Sufyan transformed our outdated website into a modern, high-performing platform. His attention to detail and technical expertise are unmatched.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Marketing Director, Growth Co.",
      content: "The performance optimization work Sufyan did improved our page load times from 8 seconds to under 2 seconds. Our users love the new experience!",
      rating: 5
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
              Let's Build
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Something Amazing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Ready to transform your digital presence? I'm here to help you create 
              a website or application that not only looks great but drives real business results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="hero" className="text-lg">
                <Link href="#contact-form">
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

      {/* Contact Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to reach me. I'm always available to discuss your project 
              and answer any questions you might have.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {info.link ? (
                  <Link href={info.link} className="block">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <info.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                    <p className="text-primary font-medium mb-2">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </Link>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <info.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                    <p className="text-primary font-medium mb-2">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Professional Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Connect With Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow my work, connect professionally, or hire me through your preferred platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {socialLinks.map((link, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <link.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                <p className="text-primary font-medium mb-2">{link.value}</p>
                <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={link.link} target="_blank" rel="noopener noreferrer">
                    Visit Profile
                  </Link>
                </Button>
              </Card>
            ))}
          </div>

          {/* WhatsApp Button */}
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="https://wa.me/447469753723?text=Hi%20Sufyan,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What I Can Build for You
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From simple websites to complex applications, I have the expertise 
              to bring your vision to life with cutting-edge technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projectTypes.map((type, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <type.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{type.title}</h3>
                <p className="text-muted-foreground text-center mb-6">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Start Your Project
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Tell me about your project, goals, and timeline. I'll get back to you 
                within 24 hours with a detailed proposal and next steps.
              </p>

              {/* Process Steps */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground mb-4">How It Works</h3>
                {process.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8">
              {submitStatus === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I'll get back to you within 24 hours 
                    with a detailed response and next steps.
                  </p>
                  <Button
                    onClick={() => setSubmitStatus("idle")}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+44 746 975 3723"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                        Budget Range
                      </label>
                      <Select name="budget" value={formData.budget} onValueChange={(value) => handleInputChange({ target: { name: 'budget', value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$1K-$5K">$1K - $5K</SelectItem>
                          <SelectItem value="$5K-$10K">$5K - $10K</SelectItem>
                          <SelectItem value="$10K-$25K">$10K - $25K</SelectItem>
                          <SelectItem value="$25K-$50K">$25K - $50K</SelectItem>
                          <SelectItem value="$50K+">$50K+</SelectItem>
                          <SelectItem value="Not Sure">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
                        Timeline
                      </label>
                      <Select name="timeline" value={formData.timeline} onValueChange={(value) => handleInputChange({ target: { name: 'timeline', value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASAP">ASAP</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="1-2 months">1-2 months</SelectItem>
                          <SelectItem value="3+ months">3+ months</SelectItem>
                          <SelectItem value="Not Sure">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                      Website (if any)
                    </label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Project Details *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell me about your project, goals, and any specific requirements..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="cta"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {submitStatus === "error" && (
                    <p className="text-red-500 text-sm text-center">
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What My Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it - hear from the businesses I've helped 
              transform and grow through exceptional web development.
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
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and turn your vision into reality. 
            I'm excited to help you create something amazing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="hero" variant="secondary" className="text-lg">
              <Link href="#contact-form">
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

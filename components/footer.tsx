import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  ArrowRight,
  Code,
  Palette,
  Zap,
  MessageCircle
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const services = [
    { name: "Web Development", icon: Code, href: "/services" },
    { name: "UI/UX Design", icon: Palette, href: "/services" },
    { name: "Performance Optimization", icon: Zap, href: "/services" }
  ]

  const quickLinks = [
    { name: "About Me", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@sufyanulhaq.com",
      href: "mailto:hello@sufyanulhaq.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+44 746 975 3723",
      href: "https://wa.me/447469753723"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Liverpool, UK",
      href: "#"
    }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">S</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Sufyan Ul Haq</h3>
                <p className="text-gray-400">Full-Stack Developer & Digital Strategist</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Transforming businesses through exceptional web development. Specializing in modern technologies, 
              performance optimization, and user experience design. Based in Liverpool, serving clients across the UK and worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com/Sufyanulhaq" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="https://www.linkedin.com/in/sufyanulhaq/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="https://www.fiverr.com/nexgendev_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-6 w-6" />
              </Link>
              <Link href="https://www.upwork.com/freelancers/~013b81e78082f94d09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Code className="h-6 w-6" />
              </Link>
            </div>
            

          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <service.icon className="h-4 w-4" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <info.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{info.label}</p>
                  <Link 
                    href={info.href}
                    className="text-white hover:text-primary transition-colors font-medium"
                  >
                    {info.value}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Let's discuss how I can help transform your digital presence and drive business growth. 
            Based in Liverpool, serving businesses across the UK and beyond.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/contact">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Sufyan Ul Haq. All rights reserved. | 
              <span className="ml-2">Full-Stack Developer in Liverpool, UK</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

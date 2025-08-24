import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Code, Palette, Zap, Star, TrendingUp, Users, Globe, Award, CheckCircle, Server, TestTube } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BlogSection from "@/components/blog-section"

// Force dynamic rendering to prevent build-time data fetching
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Immersive & Engaging */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        {/* Professional Development Workspace Background */}
        <div className="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Star className="h-4 w-4" />
                Full-Stack Developer & Digital Strategist
              </div>
              
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-bold text-foreground leading-tight">
                Building
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">
                  Digital Excellence
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                I transform ideas into powerful, scalable web applications that drive business growth. 
                Specializing in modern tech stacks, performance optimization, and user experience design.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="hero" className="text-lg">
                <Link href="/portfolio">
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="hero" className="text-lg">
                <Link href="/contact">
                  Start a Project
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>50+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/ai-generated/backgrounds/tech-expertise-pattern.svg')] bg-repeat opacity-15"></div>
        {/* Professional Development Workspace Background */}
        <div className="absolute inset-0 bg-[url('/images/technical-expertise-bg.jpg')] bg-cover bg-center opacity-10"></div>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Technical Expertise
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mastery of modern web technologies and development practices that drive exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Frontend */}
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Frontend Development</h3>
              <p className="text-sm text-muted-foreground mb-4">
                React, Next.js, TypeScript, Tailwind CSS
              </p>
            </Card>

            {/* Backend */}
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Server className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Backend Development</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Node.js, Express, MongoDB, PostgreSQL
              </p>
            </Card>

            {/* DevOps */}
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">DevOps & Deployment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Docker, AWS, Vercel, CI/CD
              </p>
            </Card>

            {/* Testing */}
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TestTube className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Testing & Quality</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jest, Cypress, E2E Testing
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/ai-generated/backgrounds/tech-expertise-pattern.svg')] bg-repeat opacity-10"></div>
        {/* Professional Development Workspace Background */}
        <div className="absolute inset-0 bg-[url('/images/development-process-bg.jpg')] bg-cover bg-center opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              What I Bring to Your Project
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From concept to deployment, I handle every aspect of web development with precision and creativity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Development */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Full-Stack Development</h3>
              <p className="text-muted-foreground mb-4">
                Modern, scalable applications built with React, Node.js, and cloud-native technologies.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Node.js</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">TypeScript</span>
              </div>
            </Card>

            {/* Design */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">UI/UX Design</h3>
              <p className="text-muted-foreground mb-4">
                Beautiful, intuitive interfaces that convert visitors into customers.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-sm rounded-full">Figma</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-sm rounded-full">Tailwind</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-sm rounded-full">Framer</span>
              </div>
            </Card>

            {/* Performance */}
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance & SEO</h3>
              <p className="text-muted-foreground mb-4">
                Lightning-fast websites that rank well and provide exceptional user experience.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">Core Web Vitals</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">SEO</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm rounded-full">Analytics</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[url('/images/ai-generated/backgrounds/process-pattern.svg')] bg-repeat opacity-10"></div>
        {/* Professional Development Workspace Background */}
        <div className="absolute inset-0 bg-[url('/images/development-process-bg.jpg')] bg-cover bg-center opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Development Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven methodology that ensures quality, transparency, and on-time delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Discovery & Planning</h3>
              <p className="text-muted-foreground">
                Understanding your goals, requirements, and target audience to create a comprehensive roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Design & Prototyping</h3>
              <p className="text-muted-foreground">
                Creating wireframes, mockups, and interactive prototypes to visualize the final product.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Development & Testing</h3>
              <p className="text-muted-foreground">
                Building with clean, maintainable code while conducting thorough testing throughout.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Launch & Support</h3>
              <p className="text-muted-foreground">
                Deploying your project and providing ongoing support, maintenance, and updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A showcase of my latest work, demonstrating technical expertise and creative problem-solving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Project 1 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/analytics-dashboard-project.jpg" 
                  alt="Analytics Dashboard Project"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Modern Analytics Platform</h3>
                <p className="text-muted-foreground mb-4">
                  A comprehensive dashboard for business intelligence with real-time data visualization.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Node.js</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">MongoDB</span>
                </div>
                <Button asChild variant="outline" size="cta" className="w-full">
                  <Link href="/portfolio">View Project</Link>
                </Button>
              </div>
            </Card>

            {/* Project 2 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/ecommerce-project.jpg" 
                  alt="E-commerce Platform Project"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Premium Online Store</h3>
                <p className="text-muted-foreground mb-4">
                  A high-performance e-commerce platform with advanced features and mobile optimization.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Next.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Stripe</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">PostgreSQL</span>
                </div>
                <Button asChild variant="outline" size="cta" className="w-full">
                  <Link href="/portfolio">View Project</Link>
                </Button>
              </div>
            </Card>

            {/* Project 3 */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/images/lead-generation-project.jpg" 
                  alt="Lead Generation Project"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Lead Generation Website</h3>
                <p className="text-muted-foreground mb-4">
                  A conversion-focused website designed to capture leads and drive business growth.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Vue.js</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Laravel</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">MySQL</span>
                </div>
                <Button asChild variant="outline" size="cta" className="w-full">
                  <Link href="/portfolio">View Project</Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="hero" className="text-lg">
              <Link href="/portfolio">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden" style={{
        backgroundImage: 'url(/images/client-testimonial-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Don't just take my word for it - hear from the businesses I've helped transform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Sufyan delivered an exceptional website that exceeded our expectations. His attention to detail and technical expertise are unmatched."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">JS</span>
                </div>
                <div>
                  <div className="font-semibold">John Smith</div>
                  <div className="text-sm text-muted-foreground">CEO, TechStart Inc.</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Working with Sufyan was a game-changer for our business. He transformed our vision into a powerful digital presence."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <span className="text-purple-500 font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah Miller</div>
                  <div className="text-sm text-muted-foreground">Founder, Design Studio</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">
                "Professional, reliable, and incredibly talented. Sufyan delivered our project on time and within budget."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <span className="text-green-500 font-semibold">MJ</span>
                </div>
                <div>
                  <div className="font-semibold">Mike Johnson</div>
                  <div className="text-sm text-muted-foreground">CTO, Innovation Labs</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Thoughts on modern web development, industry trends, and technical deep-dives.
            </p>
          </div>
          
          <BlogSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and turn your vision into reality. I'm here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="hero" variant="secondary" className="text-lg">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="hero" variant="outline" className="text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/portfolio">
                View My Work
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

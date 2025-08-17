import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Code, Palette, Zap } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import BlogSection from "@/components/blog-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                Hi, I'm{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sufyan</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A passionate full-stack developer crafting exceptional digital experiences with modern web technologies
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/portfolio">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Download Resume
              </Button>
            </div>

            {/* Skills Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">Full-Stack Development</h3>
                    <p className="text-sm text-muted-foreground">React, Node.js, TypeScript</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Palette className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">UI/UX Design</h3>
                    <p className="text-sm text-muted-foreground">Figma, Tailwind CSS</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">Performance</h3>
                    <p className="text-sm text-muted-foreground">Optimization & SEO</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />
    </div>
  )
}

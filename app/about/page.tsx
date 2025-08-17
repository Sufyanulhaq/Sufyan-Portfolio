import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, MapPin, Calendar, Award } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Git",
    "Docker",
    "AWS",
  ]

  const experience = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2022 - Present",
      description:
        "Led development of scalable web applications using React and Node.js, mentored junior developers, and improved system performance by 40%.",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Agency Co.",
      period: "2020 - 2022",
      description:
        "Built responsive web applications for clients, integrated third-party APIs, and collaborated with design teams to deliver pixel-perfect interfaces.",
    },
    {
      title: "Frontend Developer",
      company: "Startup Hub",
      period: "2019 - 2020",
      description:
        "Developed user interfaces for mobile-first applications, optimized performance, and implemented modern JavaScript frameworks.",
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
              <Link href="/about" className="text-foreground font-medium">
                About
              </Link>
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
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

      {/* About Content */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">About Me</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  I'm a passionate full-stack developer with over 5 years of experience creating digital solutions that
                  make a difference.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  My journey in web development started with a curiosity about how websites work, and it has evolved
                  into a deep passion for creating exceptional user experiences. I specialize in modern JavaScript
                  frameworks and have a keen eye for design.
                </p>
                <p className="text-foreground leading-relaxed">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects,
                  or sharing knowledge with the developer community through blog posts and mentoring.
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  San Francisco, CA
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Available for projects
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <img
                  src="/professional-developer-portrait.png"
                  alt="Sufyan - Full Stack Developer"
                  className="w-80 h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Experience</h2>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-card-foreground mb-1">{job.title}</h3>
                      <p className="text-primary font-medium">{job.company}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.period}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-2">50+</h3>
                <p className="text-muted-foreground">Projects Completed</p>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <Award className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-2">5+</h3>
                <p className="text-muted-foreground">Years Experience</p>
              </Card>
              <Card className="p-6 bg-card border-border text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-2">100%</h3>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

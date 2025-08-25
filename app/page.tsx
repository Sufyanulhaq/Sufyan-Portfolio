import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BlogSection from "@/components/blog-section"
import DynamicHomepage from "@/components/dynamic-homepage"

// Force dynamic rendering to prevent build-time data fetching
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Dynamic Homepage Content */}
      <DynamicHomepage />

      {/* Blog Section */}
      <BlogSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactForm from "@/models/ContactForm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, company, website, budget, timeline, source } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create contact submission
    const contactSubmission = new ContactForm({
      name,
      email,
      subject,
      message,
      phone,
      company,
      website,
      budget,
      timeline,
      source,
      ipAddress,
      userAgent,
      status: "NEW",
      priority: "MEDIUM",
    })

    await contactSubmission.save()

    // In a real app, you'd send an email notification here
    // await sendContactNotification(contactSubmission)

    return NextResponse.json({
      message: "Message sent successfully! We'll get back to you soon.",
      submissionId: contactSubmission._id.toString(),
    }, { status: 201 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}

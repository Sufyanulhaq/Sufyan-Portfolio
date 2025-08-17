import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ContactForm from "@/models/ContactForm"
import { sendContactNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, company, website, budget, timeline, source } = body

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create contact form entry
    const contactForm = new ContactForm({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone?.trim(),
      company: company?.trim(),
      website: website?.trim(),
      budget,
      timeline,
      source: source || "Website",
      ipAddress,
      userAgent,
      status: "NEW",
      priority: "MEDIUM"
    })

    await contactForm.save()

    // Send email notifications
    try {
      await sendContactNotification(contactForm)
    } catch (emailError) {
      console.error("Failed to send email notifications:", emailError)
      // Don't fail the contact form submission if emails fail
    }

    return NextResponse.json({
      message: "Thank you for your message! I'll get back to you soon.",
      success: true
    })

  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    // Basic token validation (in production, use proper JWT or similar)
    if (token !== process.env.CONTACT_FORM_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const contacts = await ContactForm.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const formattedContacts = contacts.map((contact) => ({
      ...contact,
      _id: contact._id.toString(),
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    }))

    return NextResponse.json({ contacts: formattedContacts })

  } catch (error) {
    console.error("Error fetching contact forms:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact forms" },
      { status: 500 }
    )
  }
}

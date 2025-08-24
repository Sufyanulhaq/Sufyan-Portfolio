import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, website, source } = body

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

    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('Database not configured')
    }

    const sql = neon(process.env.DATABASE_URL)

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create contact form entry
    const result = await sql`
      INSERT INTO cms.contact_forms (
        name, email, message, phone, source, ip_address, user_agent, status
      ) VALUES (
        ${name.trim()}, 
        ${email.trim().toLowerCase()}, 
        ${message.trim()}, 
        ${phone?.trim() || null}, 
        ${source || "Website"}, 
        ${ipAddress}, 
        ${userAgent}, 
        'new'
      ) RETURNING id
    `

    // TODO: Send email notifications using Resend
    // For now, just log the submission
    console.log('Contact form submitted:', { id: result[0].id, email: email.trim() })

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

    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('Database not configured')
    }

    const sql = neon(process.env.DATABASE_URL)

    const contacts = await sql`
      SELECT 
        id, name, email, message, phone, source, ip_address, user_agent, 
        status, is_read, created_at, updated_at
      FROM cms.contact_forms 
      ORDER BY created_at DESC 
      LIMIT 100
    `

    const formattedContacts = contacts.map((contact) => ({
      ...contact,
      id: contact.id.toString(),
      created_at: contact.created_at?.toISOString(),
      updated_at: contact.updated_at?.toISOString(),
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

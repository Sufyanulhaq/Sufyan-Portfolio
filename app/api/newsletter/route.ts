import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Newsletter from "@/models/Newsletter"
import { sendNewsletterWelcome } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, source } = body

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() })
    
    if (existingSubscription) {
      if (existingSubscription.isSubscribed) {
        return NextResponse.json(
          { error: "You're already subscribed to our newsletter!" },
          { status: 400 }
        )
      } else {
        // Re-subscribe existing user
        existingSubscription.isSubscribed = true
        existingSubscription.subscribedAt = new Date()
        existingSubscription.unsubscribedAt = undefined
        if (firstName) existingSubscription.firstName = firstName.trim()
        if (lastName) existingSubscription.lastName = lastName.trim()
        if (source) existingSubscription.source = source
        
        await existingSubscription.save()
        
        return NextResponse.json({
          message: "Welcome back! You've been re-subscribed to our newsletter.",
          success: true
        })
      }
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create new subscription
    const newsletter = new Newsletter({
      email: email.trim().toLowerCase(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      source: source || "Website",
      ipAddress,
      userAgent,
      isSubscribed: true,
      subscribedAt: new Date()
    })

    await newsletter.save()

    // Send welcome email
    try {
      await sendNewsletterWelcome(newsletter.email, newsletter.firstName)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the newsletter subscription if email fails
    }

    return NextResponse.json({
      message: "Thank you for subscribing to our newsletter!",
      success: true
    })

  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const subscription = await Newsletter.findOne({ email: email.toLowerCase() })
    
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (!subscription.isSubscribed) {
      return NextResponse.json(
        { error: "You're already unsubscribed" },
        { status: 400 }
      )
    }

    // Unsubscribe user
    subscription.isSubscribed = false
    subscription.unsubscribedAt = new Date()
    await subscription.save()

    return NextResponse.json({
      message: "You've been successfully unsubscribed from our newsletter.",
      success: true
    })

  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    // Basic token validation (in production, use proper JWT or similar)
    if (token !== process.env.NEWSLETTER_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const subscriptions = await Newsletter.find({})
      .sort({ subscribedAt: -1 })
      .limit(100)
      .lean()

    const formattedSubscriptions = subscriptions.map((subscription) => ({
      ...subscription,
      _id: subscription._id.toString(),
      subscribedAt: subscription.subscribedAt.toISOString(),
      unsubscribedAt: subscription.unsubscribedAt?.toISOString(),
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    }))

    return NextResponse.json({ subscriptions: formattedSubscriptions })

  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    )
  }
}

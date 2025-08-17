import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Newsletter from "@/models/Newsletter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, source } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Check if already subscribed
    const existingSubscription = await Newsletter.findOne({ email })
    if (existingSubscription) {
      if (existingSubscription.isSubscribed) {
        return NextResponse.json(
          { error: "You're already subscribed to our newsletter!" },
          { status: 400 }
        )
      } else {
        // Resubscribe
        existingSubscription.isSubscribed = true
        existingSubscription.subscribedAt = new Date()
        existingSubscription.unsubscribedAt = undefined
        await existingSubscription.save()

        return NextResponse.json({
          message: "Welcome back! You've been resubscribed to our newsletter.",
        })
      }
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Create new subscription
    const newsletterSubscription = new Newsletter({
      email,
      firstName,
      lastName,
      source,
      ipAddress,
      userAgent,
      isSubscribed: true,
      subscribedAt: new Date(),
    })

    await newsletterSubscription.save()

    // In a real app, you'd send a welcome email here
    // await sendWelcomeEmail(newsletterSubscription)

    return NextResponse.json({
      message: "Successfully subscribed to our newsletter!",
      subscriptionId: newsletterSubscription._id.toString(),
    }, { status: 201 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const subscription = await Newsletter.findOne({ email })
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    // Unsubscribe
    subscription.isSubscribed = false
    subscription.unsubscribedAt = new Date()
    await subscription.save()

    return NextResponse.json({
      message: "Successfully unsubscribed from our newsletter.",
    })
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again later." },
      { status: 500 }
    )
  }
}

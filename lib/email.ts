import nodemailer from "nodemailer"

interface EmailConfig {
  host: string
  port: number
  user: string
  pass: string
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
  website?: string
  budget?: string
  timeline?: string
  source?: string
}

export async function sendContactNotification(contactData: ContactFormData) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "hello@sufyanulhaq.com",
        pass: process.env.SMTP_PASS || "",
      },
    })

    // Email to you (notification)
    const adminEmail = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER || "hello@sufyanulhaq.com"}>`,
      to: process.env.CONTACT_EMAIL || "hello@sufyanulhaq.com",
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Contact Details</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
            ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
            ${contactData.website ? `<p><strong>Website:</strong> ${contactData.website}</p>` : ''}
            ${contactData.budget ? `<p><strong>Budget:</strong> ${contactData.budget}</p>` : ''}
            ${contactData.timeline ? `<p><strong>Timeline:</strong> ${contactData.timeline}</p>` : ''}
            ${contactData.source ? `<p><strong>Source:</strong> ${contactData.source}</p>` : ''}
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Message</h3>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              This message was sent from your portfolio website contact form.
            </p>
          </div>
        </div>
      `,
    }

    // Auto-reply to the user
    const userEmail = {
      from: `"Sufyan Ul Haq" <${process.env.SMTP_USER || "hello@sufyanulhaq.com"}>`,
      to: contactData.email,
      subject: "Thank you for your message - Sufyan Ul Haq",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Thank you for reaching out!</h2>
          
          <p>Hi ${contactData.name},</p>
          
          <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0ea5e9;">${contactData.message}</p>
          </div>
          
          <p>I typically respond within 24 hours during business days. If you have an urgent request, please don't hesitate to reach out again.</p>
          
          <p>Best regards,<br>
          <strong>Sufyan Ul Haq</strong><br>
          Full-Stack Developer</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    }

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminEmail),
      transporter.sendMail(userEmail)
    ])

    return true
  } catch (error) {
    console.error("Error sending email notifications:", error)
    return false
  }
}

export async function sendNewsletterWelcome(email: string, firstName?: string) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "hello@sufyanulhaq.com",
        pass: process.env.SMTP_PASS || "",
      },
    })

    const welcomeEmail = {
      from: `"Sufyan Ul Haq" <${process.env.SMTP_USER || "hello@sufyanulhaq.com"}>`,
      to: email,
      subject: "Welcome to My Newsletter! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Welcome to My Newsletter!</h2>
          
          <p>Hi ${firstName || "there"},</p>
          
          <p>Thank you for subscribing to my newsletter! I'm excited to share insights about web development, technology trends, and building better digital experiences.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">What to Expect</h3>
            <ul style="color: #334155;">
              <li>Latest web development insights</li>
              <li>Technology trends and updates</li>
              <li>Project case studies</li>
              <li>Tips and best practices</li>
            </ul>
          </div>
          
          <p>I'll be sending updates periodically, and you can unsubscribe at any time if you change your mind.</p>
          
          <p>Best regards,<br>
          <strong>Sufyan Ul Haq</strong><br>
          Full-Stack Developer</p>
        </div>
      `,
    }

    await transporter.sendMail(welcomeEmail)
    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}

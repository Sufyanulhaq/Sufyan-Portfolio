import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string
  source?: string
}

export interface AdminResponseData {
  adminName: string
  adminEmail: string
  responseMessage: string
  originalMessage: string
  clientName: string
  clientEmail: string
}

export async function sendContactFormNotification(data: ContactFormData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Sufyan Portfolio <noreply@sufyanulhaq.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@sufyanulhaq.com'],
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; }
            .message-box { background: white; padding: 20px; border-radius: 5px; border: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>Someone has reached out through your portfolio website</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${data.name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">${data.email}</div>
              </div>
              
              ${data.phone ? `
              <div class="field">
                <div class="label">📱 Phone</div>
                <div class="value">${data.phone}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">🌐 Source</div>
                <div class="value">${data.source || 'Website'}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://sufyanulhaq.com'}/admin/contact-forms" class="button">
                  View in Admin Panel
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent from your portfolio contact form</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
}

export async function sendClientResponse(data: AdminResponseData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Sufyan Portfolio <noreply@sufyanulhaq.com>',
      to: [data.clientEmail],
      subject: `Re: Your message to Sufyan Portfolio`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response from Sufyan Portfolio</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .response-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0; }
            .original-message { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .contact-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 Response from Sufyan Portfolio</h1>
              <p>Thank you for reaching out!</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${data.clientName}</strong>,</p>
              
              <p>Thank you for contacting me through my portfolio website. I've received your message and here's my response:</p>
              
              <div class="response-box">
                <strong>${data.adminName}'s Response:</strong><br>
                ${data.responseMessage.replace(/\n/g, '<br>')}
              </div>
              
              <div class="original-message">
                <strong>Your Original Message:</strong><br>
                ${data.originalMessage.replace(/\n/g, '<br>')}
              </div>
              
              <div class="contact-info">
                <h3>📞 Get in Touch</h3>
                <p><strong>Email:</strong> ${data.adminEmail}</p>
                <p><strong>Phone:</strong> +447469753723</p>
                <p><strong>Location:</strong> Liverpool, UK</p>
              </div>
              
              <p>I look forward to working with you!</p>
              
              <p>Best regards,<br>
              <strong>${data.adminName}</strong><br>
              Full Stack Developer</p>
            </div>
            
            <div class="footer">
              <p>This email was sent in response to your contact form submission</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Email service error:', error)
    return false
  }
}

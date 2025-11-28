import { Request, Response } from 'express';
import { SENDGRID_CONFIG } from '../config/sendgrid.config';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

/**
 * Handle contact form submissions
 */
export async function handleContactSubmission(req: Request, res: Response): Promise<Response | void> {
  try {
    const formData: ContactFormData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.inquiryType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Check if SendGrid is configured
    if (!SENDGRID_CONFIG.isConfigured()) {
      console.error('SendGrid is not properly configured. Please set SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and SENDGRID_TO_EMAIL environment variables.');
      
      // In development, log the form data instead of failing
      if (process.env['NODE_ENV'] !== 'production') {
        console.log('Contact Form Submission (Dev Mode):', formData);
        return res.status(200).json({
          success: true,
          message: 'Form submitted successfully (development mode)',
          data: {
            id: `dev-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: 'Your message has been received (development mode)'
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured'
      });
    }

    // Send email using SendGrid
    await sendContactEmail(formData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: `contact-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: 'Your message has been sent successfully'
      }
    });

  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process contact form submission'
    });
  }
}

/**
 * Send email using SendGrid API
 */
async function sendContactEmail(formData: ContactFormData): Promise<void> {
  const emailHtml = generateEmailTemplate(formData);
  const emailText = generateEmailText(formData);

  const msg = {
    to: SENDGRID_CONFIG.toEmail,
    from: SENDGRID_CONFIG.fromEmail,
    replyTo: formData.email,
    subject: `${SENDGRID_CONFIG.contactEmailSubject} - ${formData.inquiryType}`,
    text: emailText,
    html: emailHtml,
  };

  try {
    // Using fetch API to send email via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msg),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    console.log('Email sent successfully via SendGrid');
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw error;
  }
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(formData: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #667eea; }
        .field-value { margin-top: 5px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Inquiry Type:</div>
            <div class="field-value">${formData.inquiryType}</div>
          </div>
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${formData.name}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value"><a href="mailto:${formData.email}">${formData.email}</a></div>
          </div>
          ${formData.company ? `
          <div class="field">
            <div class="field-label">Company:</div>
            <div class="field-value">${formData.company}</div>
          </div>
          ` : ''}
          ${formData.phone ? `
          <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">${formData.phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">${formData.subject}</div>
          </div>
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">${formData.message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            <p>This email was sent from the DocSynk contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email
 */
function generateEmailText(formData: ContactFormData): string {
  return `
New Contact Form Submission - DocSynk

Inquiry Type: ${formData.inquiryType}
Name: ${formData.name}
Email: ${formData.email}
${formData.company ? `Company: ${formData.company}` : ''}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Subject: ${formData.subject}

Message:
${formData.message}

---
Submitted at: ${new Date().toLocaleString()}
  `.trim();
}

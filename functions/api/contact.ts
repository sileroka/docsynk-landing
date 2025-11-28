// Cloudflare Pages Function to handle contact form submissions
// This file should be at: functions/api/contact.ts

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

interface Env {
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  SENDGRID_TO_EMAIL: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.inquiryType) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email address'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if SendGrid is configured
    if (!env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY not configured');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email service not configured'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Send email using SendGrid
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: env.SENDGRID_TO_EMAIL || 'info@docsynk.cloud' }],
          subject: `New Contact: ${formData.inquiryType} - ${formData.subject}`
        }],
        from: {
          email: env.SENDGRID_FROM_EMAIL || 'noreply@docsynk.cloud',
          name: 'DocSynk Contact Form'
        },
        reply_to: {
          email: formData.email,
          name: formData.name
        },
        content: [{
          type: 'text/html',
          value: `
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
          `
        }]
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('SendGrid API error:', emailResponse.status, errorText);
      throw new Error(`SendGrid error: ${emailResponse.status}`);
    }

    console.log('✅ Email sent successfully via SendGrid');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          id: `contact-${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: 'Your message has been sent successfully'
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to process contact form submission'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

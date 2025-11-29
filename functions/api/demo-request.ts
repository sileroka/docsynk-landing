// Cloudflare Pages Function to handle demo request submissions
// This file should be at: functions/api/demo-request.ts

interface DemoRequestData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companySize: string;
  shippingRegions: string[];
  currentTools: string[];
  challenge: string;
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
    const formData: DemoRequestData = await request.json();
    console.log('🎯 Demo request received:', { 
      name: `${formData.firstName} ${formData.lastName}`, 
      email: formData.email, 
      company: formData.companyName 
    });

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.companyName || !formData.companySize || 
        !formData.shippingRegions?.length || !formData.challenge) {
      console.error('❌ Validation failed: Missing required fields');
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
      console.error('❌ SENDGRID_API_KEY not configured in environment variables');
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

    console.log('📤 Sending demo request email via SendGrid...', {
      to: env.SENDGRID_TO_EMAIL || 'info@docsynk.cloud',
      from: env.SENDGRID_FROM_EMAIL || 'noreply@docsynk.cloud'
    });

    // Format arrays for display
    const regionsText = formData.shippingRegions.join(', ');
    const toolsText = formData.currentTools?.length ? formData.currentTools.join(', ') : 'Not specified';

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
          subject: `New Demo Request - ${formData.companyName} (${formData.companySize})`
        }],
        from: {
          email: env.SENDGRID_FROM_EMAIL || 'noreply@docsynk.cloud',
          name: 'DocSynk Demo Requests'
        },
        reply_to: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
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
                .header { background: linear-gradient(135deg, #376db3 0%, #3dd0d1 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #376db3; }
                .field-value { margin-top: 5px; background: white; padding: 10px; border-radius: 3px; }
                .priority { background: #22c55e; color: white; padding: 5px 10px; border-radius: 3px; display: inline-block; margin-bottom: 10px; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🎯 New Demo Request</h2>
                  <div class="priority">High Priority - Schedule within 24 hours</div>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="field-label">Contact Name:</div>
                    <div class="field-value">${formData.firstName} ${formData.lastName}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Company:</div>
                    <div class="field-value">${formData.companyName}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Company Size:</div>
                    <div class="field-value">${formData.companySize}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Shipping Regions:</div>
                    <div class="field-value">${regionsText}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Current Tools:</div>
                    <div class="field-value">${toolsText}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Main Challenge:</div>
                    <div class="field-value">${formData.challenge.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div class="footer">
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                      <li>Review the prospect's challenge and prepare relevant use cases</li>
                      <li>Schedule a 30-minute demo call within 24 hours</li>
                      <li>Send calendar invite with Zoom link</li>
                      <li>Prepare custom demo environment if needed</li>
                    </ol>
                    <p>This request was received at ${new Date().toLocaleString()}</p>
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
      console.error('❌ SendGrid API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText
      });
      throw new Error(`SendGrid error: ${emailResponse.status}`);
    }

    console.log('✅ Demo request email sent successfully via SendGrid');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo request submitted successfully',
        data: {
          id: `demo-${Date.now()}`,
          requestDate: new Date().toISOString(),
          status: 'pending',
          message: 'We\'ll contact you within 24 hours to schedule your personalized demo'
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error processing demo request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to process demo request submission'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Create email content
    const emailBody = `
New Contact Form Submission from NETI Website

From: ${name}
Email: ${email}
Company: ${company || "Not provided"}

Message:
${message}

---
This email was sent from the NETI website contact form.
    `.trim();

    // For demonstration, we'll use a simple email service
    // In production, you would integrate with services like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend

    // Simulate email sending (replace with actual email service)
    const emailData = {
      to: "noc@neti.com.ph",
      from: email,
      subject: `Contact Form Submission from ${name}`,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
              ${message.replace(/\n/g, "<br>")}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This email was sent from the NETI website contact form.
          </p>
        </div>
      `,
    };

    // TODO: Implement actual email sending here
    // For now, we'll simulate success
    console.log("Email would be sent:", emailData);

    // You can uncomment and implement one of these email services:

    // Option 1: Using Nodemailer (requires nodemailer package)
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: 'your-smtp-host.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NETI Contact Form" <noreply@neti.com.ph>`,
      to: 'neti@neti.com.ph',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });
    */

    // Option 2: Using a service like Resend (requires @resend/node package)
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'noreply@neti.com.ph',
      to: 'neti@neti.com.ph',
      subject: emailData.subject,
      html: emailData.html,
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

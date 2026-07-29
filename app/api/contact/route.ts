import { NextRequest, NextResponse } from "next/server";
import { addToCalendars } from "@/lib/calendar";

function getResend() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

function validate(body: ContactBody): string | null {
  if (!body.name || body.name.trim().length < 2) return "Name is required.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return "A valid email is required.";
  if (!body.message || body.message.trim().length < 10)
    return "Message must be at least 10 characters.";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactBody = await req.json();
    const error = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { name, email, message } = body;
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    const resend = getResend();
    const fromEmail = `Portfolio Contact <${process.env.RESEND_FROM_EMAIL}>`;
    const truncatedMsg = message.slice(0, 120) + (message.length > 120 ? "..." : "");

    const emailPromise = resend.emails.send({
      from: fromEmail,
      to: process.env.NOTIFY_EMAIL!,
      replyTo: email,
      subject: `New Contact: ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f1117; margin-bottom: 24px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 100px; vertical-align: top;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Time</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    const ntfyTopic = process.env.NTFY_TOPIC;
    const pushPromise = ntfyTopic
      ? fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: "POST",
          headers: {
            Title: `New Lead: ${name}`,
            Tags: "briefcase,incoming_envelope",
            Priority: "high",
            Click: `mailto:${email}`,
          },
          body: `${name} (${email})\n"${truncatedMsg}"`,
        })
      : Promise.resolve();

    const now = new Date();
    const calendarPromise = addToCalendars({
      summary: `Contact form: ${name}`,
      description: `${name} (${email}) submitted the contact form.\n\n"${message}"`,
      start: now,
      end: new Date(now.getTime() + 30 * 60 * 1000),
    });

    const [emailResult, pushResult, calendarResult] = await Promise.allSettled([
      emailPromise,
      pushPromise,
      calendarPromise,
    ]);

    if (emailResult.status === "rejected" && pushResult.status === "rejected") {
      console.error("Email failed:", emailResult.reason);
      console.error("Push failed:", pushResult.reason);
      return NextResponse.json(
        { error: "Failed to send notification. Please try again." },
        { status: 500 }
      );
    }

    if (emailResult.status === "rejected") {
      console.error("Email failed:", emailResult.reason);
    }
    if (pushResult.status === "rejected") {
      console.error("Push failed:", pushResult.reason);
    }
    if (calendarResult.status === "rejected") {
      console.error("Calendar sync failed to run:", calendarResult.reason);
    } else {
      for (const r of calendarResult.value) {
        if (!r.ok) console.error(`${r.provider} calendar event failed:`, r.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Contact form error");
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

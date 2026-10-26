import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Contact form handler (replaces Contact Form 7).
 * Configure in .env.local / your host's environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO (defaults to info@legacyfoods.pk)
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → pretend success so bots move on.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 5 || message.length > 5000) {
    return NextResponse.json({ error: "Please write a message (5–5000 characters)." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const to = process.env.CONTACT_TO || "info@legacyfoods.pk";

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[contact] SMTP is not configured; message not sent.");
    return NextResponse.json({ error: "The contact form isn't set up yet." }, { status: 503 });
  }

  try {
    const port = Number(SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Legacy Foods website" <${SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `Website message from ${email}`,
      text: `From: ${email}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ error: "Your message couldn't be sent right now." }, { status: 502 });
  }
}

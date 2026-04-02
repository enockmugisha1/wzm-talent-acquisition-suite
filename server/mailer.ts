import nodemailer from "nodemailer";
import { log } from "./index";

// Transporter is created lazily so it always reads process.env AFTER dotenv has loaded.
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

// Send one notification email to ALL admins at once
export async function sendContactNotificationEmail(opts: {
  recipients: { email: string; username: string }[];
  contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submittedAt: Date;
  };
}) {
  if (opts.recipients.length === 0) {
    log("No admin recipients found — skipping contact notification email", "mailer");
    return;
  }

  const transporter = createTransporter();
  const APP_URL = process.env.APP_URL || "http://localhost:5000";
  const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "WZM HR <no-reply@wzm-hr.com>";
  const toList = opts.recipients.map((r) => r.email).join(", ");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
      <h2 style="color:#0B3D91;margin:0 0 8px;">📬 New Contact Message Received</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;">
        Hi Team,<br/>
        Someone has sent a message through the <strong>WZM HR</strong> website contact form.
      </p>
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#888;width:90px;vertical-align:top;font-weight:600;">From:</td>
            <td style="padding:8px 0;color:#1a1a1a;font-weight:700;">${opts.contact.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#888;vertical-align:top;font-weight:600;">Email:</td>
            <td style="padding:8px 0;color:#1a1a1a;"><a href="mailto:${opts.contact.email}" style="color:#0B3D91;">${opts.contact.email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#888;vertical-align:top;font-weight:600;">Subject:</td>
            <td style="padding:8px 0;color:#1a1a1a;font-weight:600;">${opts.contact.subject}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#888;vertical-align:top;font-weight:600;">Date:</td>
            <td style="padding:8px 0;color:#1a1a1a;">${new Date(opts.contact.submittedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#888;vertical-align:top;font-weight:600;">Message:</td>
            <td style="padding:8px 0;color:#333;line-height:1.7;white-space:pre-wrap;">${opts.contact.message.replace(/\n/g, "<br/>")}</td>
          </tr>
        </table>
      </div>
      <div style="text-align:center;margin:24px 0;">
        <a href="${APP_URL}/admin"
           style="background:#0B3D91;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
          View in Dashboard
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="color:#aaa;font-size:12px;text-align:center;">
        WZM Human Resource Solution Co. Ltd &middot; wmhrsolution@gmail.com
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: toList,
      subject: `📬 New Contact Message: ${opts.contact.subject}`,
      html,
    });
    log(`Contact notification sent to: ${toList}`, "mailer");
  } catch (err) {
    console.error("[mailer] Contact notification email failed:", err);
    log(`Contact notification email failed — check SMTP config in .env`, "mailer");
  }
}

export async function sendContactReplyEmail(opts: {
  toEmail: string;
  toName: string;
  originalSubject: string;
  replyMessage: string;
  repliedBy: string;
}) {
  const transporter = createTransporter();
  const APP_URL = process.env.APP_URL || "http://localhost:5000";
  const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "WZM HR <no-reply@wzm-hr.com>";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
      <h2 style="color:#0B3D91;margin:0 0 8px;">Reply from WZM HR</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;">
        Hi <strong>${opts.toName}</strong>,<br/>
        Thank you for reaching out. <strong>${opts.repliedBy}</strong> from the WZM HR team has replied to your message.
      </p>
      <div style="background:#fff;border-left:4px solid #0B3D91;border-radius:0 8px 8px 0;padding:20px;margin:20px 0;">
        <p style="color:#888;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.5px;">Re: ${opts.originalSubject}</p>
        <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${opts.replyMessage.replace(/\n/g, "<br/>")}</p>
      </div>
      <p style="color:#555;font-size:14px;line-height:1.6;">
        If you have further questions, feel free to reply to this email or visit our website.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${APP_URL}/contact"
           style="background:#0B3D91;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">
          Visit Our Website
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="color:#aaa;font-size:12px;text-align:center;">
        WZM Human Resource Solution Co. Ltd &middot; wmhrsolution@gmail.com &middot; +250796661213
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.toEmail,
      subject: `Re: ${opts.originalSubject}`,
      html,
    });
    log(`Reply email sent to ${opts.toEmail}`, "mailer");
  } catch (err) {
    console.error("[mailer] Reply email failed:", err);
    throw err;
  }
}

export async function sendPasswordSetupEmail(opts: {
  toEmail: string;
  toUsername: string;
  resetToken: string;
  createdByUsername: string;
}) {
  const transporter = createTransporter();
  const APP_URL = process.env.APP_URL || "http://localhost:5000";
  const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "WZM HR <no-reply@wzm-hr.com>";

  const resetLink = `${APP_URL}/admin/reset-password?token=${opts.resetToken}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
      <img src="${APP_URL}/favicon.png" alt="WZM HR" style="height:48px;margin-bottom:24px;" />
      <h2 style="color:#0B3D91;margin:0 0 8px;">You've been added as an Admin</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;">
        Hi <strong>${opts.toUsername}</strong>,<br/>
        <strong>${opts.createdByUsername}</strong> has created an admin account for you on the
        <strong>WZM HR Talent Acquisition Suite</strong>.
      </p>
      <p style="color:#555;font-size:15px;line-height:1.6;">
        Click the button below to set your password and access your account.
        This link expires in <strong>24 hours</strong>.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetLink}"
           style="background:#0B3D91;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">
          Set My Password
        </a>
      </div>
      <p style="color:#888;font-size:13px;">
        Or paste this link in your browser:<br/>
        <a href="${resetLink}" style="color:#1E5EFF;">${resetLink}</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="color:#aaa;font-size:12px;text-align:center;">
        WZM Human Resource Solution Co. Ltd &middot; wmhrsolution@gmail.com
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: opts.toEmail,
      subject: "Your WZM HR Admin Account — Set Your Password",
      html,
    });
    log(`Password setup email sent to ${opts.toEmail}`, "mailer");
  } catch (err) {
    // Log but don't crash the server if email fails
    console.error("[mailer] Failed to send email:", err);
    log(`Email to ${opts.toEmail} failed — check SMTP config in .env`, "mailer");
  }
}

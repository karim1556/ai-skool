// Email helper supporting SMTP (Mailtrap) first, with Resend fallback.
// SMTP envs: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// Resend envs: RESEND_API_KEY, RESEND_FROM

export async function sendEmail(options: {
  to: string,
  subject: string,
  html?: string,
  text?: string,
  from?: string,
}) {
  // Prefer SMTP if configured
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = options.from || process.env.SMTP_FROM

  if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
    const nodemailer = await import('nodemailer').then((m:any) => m.default || m)
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: { user: smtpUser, pass: smtpPass },
    })
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
    return { smtp: true, messageId: info.messageId }
  }

  // Fallback to Resend HTTP API
  const apiKey = process.env.RESEND_API_KEY
  const from = options.from || process.env.RESEND_FROM || 'noreply@example.com'
  if (!apiKey) {
    console.warn('[email] No SMTP or RESEND configured. Would have sent email to', options.to, 'subject:', options.subject)
    return { skipped: true } as const
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [options.to], subject: options.subject, html: options.html, text: options.text }),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Failed to send email: ${res.status} ${msg}`)
  }
  return await res.json()
}

export async function sendPasswordEmail(to: string, password: string, context?: { name?: string, appName?: string, loginUrl?: string }) {
  const appName = context?.appName || 'LMS Portal';
  const loginUrl = context?.loginUrl || process.env.NEXT_PUBLIC_APP_URL || '';
  const name = context?.name || '';
  const subject = `${appName} account credentials`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <p>${name ? `Hi ${name},` : 'Hello,'}</p>
      <p>Your ${appName} account has been created. Here are your credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${to}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      ${loginUrl ? `<p>Login here: <a href="${loginUrl}">${loginUrl}</a></p>` : ''}
      <p>Please change your password after first login.</p>
      <p>Thanks,<br/>${appName} Team</p>
    </div>
  `;
  const text = `Your ${appName} account has been created. Email: ${to} Password: ${password}. ${loginUrl ? `Login: ${loginUrl}` : ''}`;
  return sendEmail({ to, subject, html, text });
}

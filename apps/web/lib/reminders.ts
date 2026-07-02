import { Resend } from "resend"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay } from "@/lib/accountability"

const CTA_URL = "https://founderbox.loopxo.org/accountability/today"

function reminderEmailHtml() {
  return `
  <div style="margin:0;padding:0;background:#111118;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
      <div style="border:1px solid #2A2A38;border-radius:12px;background:#18181F;padding:32px;">
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#D4A853;">FounderBox</p>
        <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#EDE9DC;">Don't break your streak</h1>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#9E9880;">
          You haven't logged anything today. Take a minute to capture today's proof and keep your accountability streak alive.
        </p>
        <a href="${CTA_URL}" style="display:inline-block;background:#D4A853;color:#111118;font-size:14px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:8px;">
          Log today's proof
        </a>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6B6655;">
          You're receiving this because daily reminders are enabled. Update your preferences in accountability settings anytime.
        </p>
      </div>
    </div>
  </div>`
}

/**
 * Emails users who enabled daily reminders but have not logged any entry today.
 * Resilient: a single failed send does not abort the batch.
 */
export async function sendDailyReminders() {
  const preferences = await prisma.notificationPreference.findMany({
    where: { dailyReminder: true },
    include: { user: true },
  })

  const candidates = preferences.length
  let emailed = 0
  let skipped = 0

  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const resend = resendKey && from ? new Resend(resendKey) : null

  for (const preference of preferences) {
    try {
      const user = preference.user
      if (!user?.email) {
        skipped += 1
        continue
      }

      const membership = await prisma.workspaceMember.findFirst({
        where: { userId: user.id },
        include: { workspace: true },
        orderBy: { createdAt: "asc" },
      })

      if (!membership?.workspace) {
        skipped += 1
        continue
      }

      const entriesToday = await prisma.entry.count({
        where: {
          workspaceId: membership.workspace.id,
          archivedAt: null,
          happenedAt: { gte: startOfDay(), lt: endOfDay() },
        },
      })

      if (entriesToday >= 1) {
        skipped += 1
        continue
      }

      // Skip actually sending when Resend is not configured, but still count the candidate as skipped.
      if (!resend || !from) {
        skipped += 1
        continue
      }

      const { error } = await resend.emails.send({
        from,
        to: user.email,
        subject: "Don't break your streak — log today's proof",
        html: reminderEmailHtml(),
      })

      if (error) {
        skipped += 1
        continue
      }

      emailed += 1
    } catch {
      skipped += 1
    }
  }

  return { candidates, emailed, skipped }
}

const webUrl = (process.env.FOUNDERBOX_WEB_URL || "http://localhost:3000").replace(/\/$/, "")
const secret = process.env.CRON_SECRET

if (!secret) {
  console.error("CRON_SECRET is required.")
  process.exit(1)
}

const response = await fetch(`${webUrl}/api/jobs/artifact-cleanup`, {
  method: "POST",
  headers: { "x-founderbox-cron-secret": secret },
})

const text = await response.text()
if (!response.ok) {
  console.error(text)
  process.exit(1)
}

console.log(text)


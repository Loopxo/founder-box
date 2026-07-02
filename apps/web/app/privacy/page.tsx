export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#111118] px-6 py-12 text-[#EDE9DC]">
      <article className="mx-auto max-w-3xl">
        <p className="studio-label mb-3">FounderBox</p>
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-[#9E9880]">
          <p>FounderBox stores account, workspace, accountability, billing, API key, artifact, and proof metadata needed to run the service.</p>
          <p>API keys, OTP codes, and session tokens are stored as hashes. File proof is stored in configured object storage. Billing state is synced from Lemon Squeezy.</p>
          <p>We use privacy-safe product and operational telemetry only to operate and improve FounderBox. Users can request account export or deletion through support.</p>
          <p>This page is a product placeholder and must be reviewed before public launch.</p>
        </div>
      </article>
    </main>
  )
}

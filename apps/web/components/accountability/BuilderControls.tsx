"use client"

import { FormEvent, useState } from "react"

type FlowSummary = {
  id: string
  name: string
}

type TemplateSummary = {
  key: string
  name: string
  persona: string
}

async function requestJson(path: string, init: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  })
  const json = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(json.error || "Request failed.")
  return json
}

export default function BuilderControls({ flows, templates, canCreateFlow }: { flows: FlowSummary[]; templates: TemplateSummary[]; canCreateFlow: boolean }) {
  const [status, setStatus] = useState<string>("")
  const [error, setError] = useState<string>("")

  async function run(action: () => Promise<void>) {
    setStatus("")
    setError("")
    try {
      await action()
      setStatus("Saved.")
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something failed.")
    }
  }

  function createFlow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    run(async () => {
      await requestJson("/api/flows", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name") || "Custom flow",
          persona: data.get("persona") || "solo operator",
          description: data.get("description") || "",
        }),
      })
    })
  }

  function installTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    run(async () => {
      await requestJson("/api/flows", {
        method: "POST",
        body: JSON.stringify({ templateKey: data.get("templateKey") }),
      })
    })
  }

  function importFlow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    run(async () => {
      const raw = String(data.get("json") || "")
      await requestJson("/api/flows/import", {
        method: "POST",
        body: raw,
      })
    })
  }

  const input = "w-full rounded border border-[#2A2A38] bg-[#111118] px-3 py-2 text-sm text-[#EDE9DC] outline-none"
  const button = "rounded bg-[#D4A853] px-3 py-2 text-sm font-semibold text-[#111118] disabled:cursor-not-allowed disabled:opacity-50"
  const secondary = "rounded border border-[#2A2A38] px-3 py-2 text-sm font-semibold text-[#EDE9DC]"

  return (
    <div className="mb-6 grid gap-4 xl:grid-cols-3">
      <form onSubmit={createFlow} className="rounded border border-[#2A2A38] bg-[#18181F] p-4">
        <h2 className="text-sm font-semibold text-[#EDE9DC]">Create Flow</h2>
        <div className="mt-4 space-y-3">
          <input name="name" className={input} placeholder="Custom operator flow" />
          <input name="persona" className={input} placeholder="solo dev" />
          <textarea name="description" className={input} placeholder="What this flow tracks" />
          <button disabled={!canCreateFlow} className={button}>Create</button>
        </div>
      </form>

      <form onSubmit={installTemplate} className="rounded border border-[#2A2A38] bg-[#18181F] p-4">
        <h2 className="text-sm font-semibold text-[#EDE9DC]">Install Template</h2>
        <div className="mt-4 space-y-3">
          <select name="templateKey" className={input}>
            {templates.map((template) => (
              <option key={template.key} value={template.key}>{template.name} - {template.persona}</option>
            ))}
          </select>
          <button disabled={!canCreateFlow} className={button}>Install</button>
        </div>
      </form>

      <form onSubmit={importFlow} className="rounded border border-[#2A2A38] bg-[#18181F] p-4">
        <h2 className="text-sm font-semibold text-[#EDE9DC]">Import Flow JSON</h2>
        <div className="mt-4 space-y-3">
          <textarea name="json" className={`${input} min-h-24`} placeholder='{"flow": {...}}' />
          <button disabled={!canCreateFlow} className={button}>Import</button>
        </div>
      </form>

      <div className="rounded border border-[#2A2A38] bg-[#18181F] p-4 xl:col-span-3">
        <h2 className="text-sm font-semibold text-[#EDE9DC]">Flow Operations</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {flows.map((flow) => (
            <div key={flow.id} className="flex items-center justify-between gap-3 rounded border border-[#2A2A38] p-3">
              <span className="truncate text-sm text-[#EDE9DC]">{flow.name}</span>
              <div className="flex shrink-0 gap-2">
                <a className={secondary} href={`/api/flows/${flow.id}/export`}>Export</a>
                <button className={secondary} onClick={() => run(() => requestJson(`/api/flows/${flow.id}/duplicate`, { method: "POST", body: "{}" }).then(() => undefined))}>Duplicate</button>
                <button className={secondary} onClick={() => run(() => requestJson(`/api/flows/${flow.id}`, { method: "PATCH", body: JSON.stringify({ archived: true }) }).then(() => undefined))}>Archive</button>
              </div>
            </div>
          ))}
        </div>
        {status && <p className="mt-3 text-sm text-[#D4A853]">{status}</p>}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  )
}


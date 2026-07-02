import { readFileSync, existsSync } from "node:fs"
import { spawn } from "node:child_process"
import { resolve } from "node:path"

function parseEnvLine(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) return null
  const index = trimmed.indexOf("=")
  if (index === -1) return null

  const key = trimmed.slice(0, index).trim()
  let value = trimmed.slice(index + 1).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  return key ? [key, value] : null
}

const envPath = resolve(process.cwd(), ".env")
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const parsed = parseEnvLine(line)
    if (!parsed) continue
    const [key, value] = parsed
    if (process.env[key] === undefined) process.env[key] = value
  }
}

const [command, ...args] = process.argv.slice(2)
if (!command) {
  console.error("Usage: node scripts/run-with-root-env.mjs <command> [...args]")
  process.exit(1)
}

const child = spawn(command, args, {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})

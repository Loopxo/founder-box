import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const root = join(process.cwd(), "skills")
const skillDirs = readdirSync(root).filter((name) => statSync(join(root, name)).isDirectory())
const failures = []

for (const dir of skillDirs) {
  const file = join(root, dir, "SKILL.md")
  let text = ""
  try {
    text = readFileSync(file, "utf8")
  } catch {
    failures.push(`${dir}: missing SKILL.md`)
    continue
  }

  if (!/`[a-z0-9_]+`/.test(text)) failures.push(`${dir}: missing backticked tool references`)
  if (text.length > 6000) failures.push(`${dir}: skill is too long; keep instructions concise`)
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log(`Checked ${skillDirs.length} FounderBox skills.`)

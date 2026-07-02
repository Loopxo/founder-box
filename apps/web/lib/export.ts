import * as XLSX from "xlsx"

export type ExportEntry = {
  id: string
  happenedAt: Date
  title: string | null
  summary: string | null
  systemType: string | null
  data: unknown
}

function flattenData(data: unknown) {
  return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {}
}

function csvCell(value: unknown) {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export function entriesToRows(entries: ExportEntry[]) {
  return entries.map((entry) => ({
    id: entry.id,
    happenedAt: entry.happenedAt.toISOString(),
    type: entry.systemType || "",
    title: entry.title || "",
    summary: entry.summary || "",
    ...flattenData(entry.data),
  }))
}

export function entriesToCsv(entries: ExportEntry[]) {
  const rows = entriesToRows(entries)
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  return [headers.map(csvCell).join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header as keyof typeof row])).join(","))].join("\n")
}

export function entriesToXlsx(entries: ExportEntry[]) {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(entriesToRows(entries))
  XLSX.utils.book_append_sheet(workbook, worksheet, "FounderBox Export")
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

export function createSimplePdf(title: string, text: string) {
  const lines = [title, "", ...text.split(/\r?\n/)].slice(0, 45)
  const content = lines.map((line, index) => `BT /F1 11 Tf 50 ${760 - index * 16} Td (${escapePdfText(line.slice(0, 95))}) Tj ET`).join("\n")
  const stream = Buffer.from(content, "utf8")
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${content}\nendstream`,
  ]

  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`).join("")
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf, "binary")
}

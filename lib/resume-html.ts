// ─────────────────────────────────────────────────────────────────────────────
// Shared resume HTML builder — used by BOTH the live preview iframe AND the
// PDF API route. This guarantees preview = PDF, always.
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  name: string; title: string; email: string; phone: string
  location: string; linkedin: string; github: string; website: string
}
export interface ExperienceEntry {
  id: string; title: string; company: string; companyUrl: string
  location: string; startDate: string; endDate: string; current: boolean; bullets: string
}
export interface EducationEntry {
  id: string; degree: string; school: string; location: string
  startDate: string; endDate: string; gpa: string
}
export interface SkillEntry { id: string; category: string; items: string }
export interface ProjectEntry {
  id: string; name: string; url: string; tech: string
  description: string; startDate: string; endDate: string
}
export interface CertificationEntry {
  id: string; name: string; provider: string; url: string; date: string; bullets: string
}
export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
}

// ─── Classic template — 1-page ATS-safe HTML ─────────────────────────────────
function classicHTML(data: ResumeData): string {
  const { personal: p, summary, experience, education, skills, projects, certifications } = data

  const bullets = (text: string) =>
    text.split('\n').filter(Boolean).map(b => `<li>${b.replace(/^[-•○]\s*/, '')}</li>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@page { margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 8.5in; }
body {
  font-family: Arial, sans-serif;
  font-size: 9pt;
  line-height: 1.25;
  padding: 0.35in 0.45in;
  color: #000;
  background: #fff;
}
/* HEADER */
.hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1px; }
.hdr-name { font-size: 18pt; font-weight: 900; text-transform: uppercase; }
.hdr-right { text-align: right; font-size: 8.5pt; line-height: 1.5; }
.hdr-right a { color: #1155CC; text-decoration: none; }
.links { font-size: 8.5pt; margin-bottom: 5px; }
.links a { color: #1155CC; text-decoration: none; margin-right: 8px; }
/* SECTIONS */
.sec { margin-bottom: 6px; }
.sh-line { border: none; border-top: 0.75px solid #000; margin: 0; }
.sh-wrap { text-align: center; padding: 1px 0; }
.sh-text { font-size: 9.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; }
/* TWO-COL ROW */
.row { display: flex; justify-content: space-between; align-items: baseline; }
.row-left { flex: 1; }
.row-right { text-align: right; white-space: nowrap; padding-left: 8px; font-size: 8.5pt; }
/* EDUCATION */
.edu { margin-bottom: 4px; }
.inst { font-weight: bold; font-size: 9pt; }
.deg { font-size: 8.5pt; }
/* SKILLS */
.sk-row { display: flex; align-items: baseline; margin-bottom: 2px; font-size: 8.5pt; }
.sk-bullet { margin-right: 4px; }
.sk-cat { font-weight: bold; margin-right: 3px; white-space: nowrap; }
/* EXP/PROJ */
.entry { margin-bottom: 6px; }
.etitle { font-weight: bold; font-size: 9pt; }
.etitle a { color: #1155CC; text-decoration: none; }
.edate { font-size: 8.5pt; white-space: nowrap; padding-left: 8px; }
.loc { font-size: 8.5pt; color: #333; }
.bul { list-style: none; padding-left: 12px; margin-top: 2px; }
.bul li { font-size: 8.5pt; margin-bottom: 1px; padding-left: 10px; position: relative; }
.bul li::before { content: "○"; position: absolute; left: 0; font-size: 7.5pt; }
/* CERT */
.cert { margin-bottom: 5px; }
.ctitle { font-weight: bold; font-size: 9pt; }
.ctitle a { color: #1155CC; text-decoration: none; }
</style></head><body>

<div class="hdr">
  <div class="hdr-name">${p.name || 'FULL NAME'}</div>
  <div class="hdr-right">
    ${p.email ? `<div>Email: <a href="mailto:${p.email}">${p.email}</a></div>` : ''}
    ${p.phone ? `<div>Mobile: ${p.phone}</div>` : ''}
    ${p.location ? `<div>${p.location}</div>` : ''}
  </div>
</div>
<div class="links">
  ${p.linkedin ? `<a href="https://${p.linkedin.replace(/^https?:\/\//, '')}">${p.linkedin}</a>` : ''}
  ${p.github ? `<a href="https://${p.github.replace(/^https?:\/\//, '')}">${p.github}</a>` : ''}
  ${p.website ? `<a href="https://${p.website.replace(/^https?:\/\//, '')}">${p.website}</a>` : ''}
</div>

${education.some(e => e.degree) ? `
<div class="sec">
  <hr class="sh-line"/>
  <div class="sh-wrap"><span class="sh-text">EDUCATION</span></div>
  <hr class="sh-line"/>
  ${education.filter(e => e.degree).map(e => `
  <div class="edu">
    <div class="row">
      <div class="row-left"><span class="inst">${e.school || ''}</span></div>
      <div class="row-right">${e.location || ''}</div>
    </div>
    <div class="row">
      <div class="row-left deg">${e.degree}${e.gpa ? `; GPA: ${e.gpa}` : ''}</div>
      <div class="row-right">${e.startDate ? `${e.startDate} - ${e.endDate || 'Present'}` : e.endDate || ''}</div>
    </div>
  </div>`).join('')}
</div>` : ''}

${skills.some(s => s.items) ? `
<div class="sec">
  <hr class="sh-line"/>
  <div class="sh-wrap"><span class="sh-text">SKILLS SUMMARY</span></div>
  <hr class="sh-line"/>
  ${skills.filter(s => s.items).map(s => `
  <div class="sk-row">
    <span class="sk-bullet">•</span>
    ${s.category ? `<span class="sk-cat">${s.category}:</span>` : ''}
    <span>${s.items}</span>
  </div>`).join('')}
</div>` : ''}

${experience.some(e => e.title) ? `
<div class="sec">
  <hr class="sh-line"/>
  <div class="sh-wrap"><span class="sh-text">WORK EXPERIENCE</span></div>
  <hr class="sh-line"/>
  ${experience.filter(e => e.title).map(e => `
  <div class="entry">
    <div class="row">
      <div class="row-left">
        <span class="etitle">${e.title}${e.company ? ` | ${e.company}` : ''}${e.companyUrl ? ` | <a href="https://${e.companyUrl.replace(/^https?:\/\//, '')}">LINK</a>` : ''}</span>
      </div>
      <div class="row-right edate">${e.startDate ? `${e.startDate} - ${e.current ? 'Present' : e.endDate || 'Present'}` : ''}</div>
    </div>
    ${e.location ? `<div class="loc">${e.location}</div>` : ''}
    ${e.bullets ? `<ul class="bul">${bullets(e.bullets)}</ul>` : ''}
  </div>`).join('')}
</div>` : ''}

${projects.some(pr => pr.name) ? `
<div class="sec">
  <hr class="sh-line"/>
  <div class="sh-wrap"><span class="sh-text">PROJECTS</span></div>
  <hr class="sh-line"/>
  ${projects.filter(pr => pr.name).map(pr => `
  <div class="entry">
    <div class="row">
      <div class="row-left">
        <span class="etitle">${pr.name}${pr.url ? ` | <a href="https://${pr.url.replace(/^https?:\/\//, '')}">LINK</a>` : ''}</span>
      </div>
      <div class="row-right edate">${pr.startDate ? `${pr.startDate} - ${pr.endDate || 'Present'}` : ''}</div>
    </div>
    ${pr.tech ? `<div class="loc">${pr.tech}</div>` : ''}
    ${pr.description ? `<ul class="bul">${bullets(pr.description)}</ul>` : ''}
  </div>`).join('')}
</div>` : ''}

${certifications.some(c => c.name) ? `
<div class="sec">
  <hr class="sh-line"/>
  <div class="sh-wrap"><span class="sh-text">CERTIFICATES</span></div>
  <hr class="sh-line"/>
  ${certifications.filter(c => c.name).map(c => `
  <div class="cert">
    <div class="row">
      <div class="row-left">
        <span class="ctitle">${c.name}${c.provider ? ` | ${c.provider}` : ''}${c.url ? ` | <a href="${c.url}">CERTIFICATE</a>` : ''}</span>
      </div>
      <div class="row-right edate">${c.date || ''}</div>
    </div>
    ${c.bullets ? `<ul class="bul">${bullets(c.bullets)}</ul>` : ''}
  </div>`).join('')}
</div>` : ''}

</body></html>`
}

// ─── Main export: build HTML for any template ────────────────────────────────
export function buildResumeHTML(data: ResumeData, template: string): string {
  // The classic template uses the ATS-optimised single-page layout above.
  // Other templates keep their own style but also use compact CSS.
  if (template === 'classic') return classicHTML(data)

  const { personal: p, summary, experience, education, skills, projects } = data
  const base = `<style>*{margin:0;padding:0;box-sizing:border-box}@page{size:letter;margin:0}html,body{width:8.5in;height:11in;overflow:hidden}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>`

  if (template === 'modern') {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${base}<style>
body{font-family:Arial,sans-serif;font-size:9.5pt;line-height:1.3;display:flex}
.sidebar{width:32%;background:#1e293b;color:#f1f5f9;padding:22px 16px;min-height:11in}
.main{width:68%;padding:22px 20px}
.name{font-size:16pt;font-weight:bold;color:#00D4FF;margin-bottom:3px}
.role{font-size:9.5pt;color:#94a3b8;margin-bottom:12px}
.sh{font-size:8pt;letter-spacing:1.5px;text-transform:uppercase;color:#00D4FF;border-bottom:1px solid #334155;padding-bottom:3px;margin:10px 0 5px;font-weight:bold}
.si{font-size:8.5pt;color:#cbd5e1;margin-bottom:3px}
.tag{display:inline-block;background:#334155;color:#e2e8f0;border-radius:3px;padding:1px 6px;margin:1px;font-size:8pt}
.mh{font-size:9pt;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#1e293b;border-bottom:2px solid #00D4FF;padding-bottom:3px;margin:10px 0 6px}
.entry{margin-bottom:8px}
.row{display:flex;justify-content:space-between}
.bold{font-weight:bold}.sub{font-size:8.5pt;color:#64748b}
.date{font-size:8.5pt;color:#64748b;white-space:nowrap}
ul{padding-left:14px;margin-top:2px}li{font-size:8.5pt;margin-bottom:1px}
</style></head><body>
<div class="sidebar">
  <div class="name">${p.name || 'Your Name'}</div>
  <div class="role">${p.title || ''}</div>
  <div class="sh">Contact</div>
  ${p.email ? `<div class="si">✉ ${p.email}</div>` : ''}
  ${p.phone ? `<div class="si">📞 ${p.phone}</div>` : ''}
  ${p.location ? `<div class="si">📍 ${p.location}</div>` : ''}
  ${p.linkedin ? `<div class="si">in ${p.linkedin}</div>` : ''}
  ${p.github ? `<div class="si">⌥ ${p.github}</div>` : ''}
  ${p.website ? `<div class="si">🌐 ${p.website}</div>` : ''}
  ${skills.some(s => s.items) ? `<div class="sh">Skills</div>${skills.filter(s => s.items).map(s => `${s.category ? `<div class="sub" style="margin-top:3px">${s.category}</div>` : ''}${s.items.split(',').map(i => `<span class="tag">${i.trim()}</span>`).join('')}`).join('')}` : ''}
  ${education.some(e => e.degree) ? `<div class="sh">Education</div>${education.filter(e => e.degree).map(e => `<div class="si" style="margin-bottom:4px"><b>${e.degree}</b><br>${e.school || ''}${e.endDate ? ` · ${e.endDate}` : ''}</div>`).join('')}` : ''}
</div>
<div class="main">
  ${summary ? `<div style="margin-bottom:10px"><div class="mh">Summary</div><p style="font-size:9pt">${summary}</p></div>` : ''}
  ${experience.some(e => e.title) ? `<div style="margin-bottom:10px"><div class="mh">Experience</div>${experience.filter(e => e.title).map(e => `<div class="entry"><div class="row"><span class="bold">${e.title}${e.company ? ` @ ${e.company}` : ''}</span><span class="date">${e.startDate || ''}${e.current ? ' – Present' : e.endDate ? ` – ${e.endDate}` : ''}</span></div>${e.location ? `<div class="sub">${e.location}</div>` : ''}${e.bullets ? `<ul>${e.bullets.split('\n').filter(Boolean).map(b => `<li>${b.replace(/^[-•]\s*/, '')}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : ''}
  ${projects.some(pr => pr.name) ? `<div style="margin-bottom:10px"><div class="mh">Projects</div>${projects.filter(pr => pr.name).map(pr => `<div class="entry"><div class="row"><span class="bold">${pr.name}</span>${pr.url ? `<span style="font-size:8.5pt;color:#1a56db">${pr.url}</span>` : ''}</div>${pr.tech ? `<div class="sub">${pr.tech}</div>` : ''}${pr.description ? `<p style="font-size:8.5pt;margin-top:2px">${pr.description}</p>` : ''}</div>`).join('')}</div>` : ''}
</div>
</body></html>`
  }

  if (template === 'executive') {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${base}<style>
body{font-family:Arial,sans-serif;font-size:9.5pt;line-height:1.3;padding:0;background:#fff;color:#111}
.hdr{background:#0f172a;color:#fff;padding:20px 36px}
h1{font-size:18pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.role{font-size:9.5pt;color:#00D4FF;letter-spacing:1px;margin-bottom:6px}
.contact{font-size:8.5pt;color:#94a3b8;display:flex;flex-wrap:wrap;gap:8px}
.body{padding:18px 36px}
.sec{margin-bottom:12px}
.st{font-size:9pt;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#0f172a;border-left:4px solid #00D4FF;padding-left:8px;margin-bottom:6px}
.entry{margin-bottom:7px;padding-left:12px}
.row{display:flex;justify-content:space-between}
.bold{font-weight:bold}.sub{font-size:8.5pt;color:#64748b}
.date{font-size:8.5pt;color:#64748b;white-space:nowrap}
ul{padding-left:14px;margin-top:2px}li{font-size:8.5pt;margin-bottom:1px}
.chip{display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:3px;padding:1px 7px;margin:1px;font-size:8pt}
</style></head><body>
<div class="hdr">
  <h1>${p.name || 'Your Name'}</h1>
  <div class="role">${p.title || 'Founder & CEO'}</div>
  <div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).map(v => `<span>${v}</span>`).join('')}</div>
</div>
<div class="body">
  ${summary ? `<div class="sec"><div class="st">Executive Summary</div><p>${summary}</p></div>` : ''}
  ${experience.some(e => e.title) ? `<div class="sec"><div class="st">Leadership & Experience</div>${experience.filter(e => e.title).map(e => `<div class="entry"><div class="row"><span class="bold">${e.title}${e.company ? ` · ${e.company}` : ''}</span><span class="date">${e.startDate || ''}${e.current ? ' – Present' : e.endDate ? ` – ${e.endDate}` : ''}</span></div>${e.location ? `<div class="sub">${e.location}</div>` : ''}${e.bullets ? `<ul>${e.bullets.split('\n').filter(Boolean).map(b => `<li>${b.replace(/^[-•]\s*/, '')}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : ''}
  ${education.some(e => e.degree) ? `<div class="sec"><div class="st">Education</div>${education.filter(e => e.degree).map(e => `<div class="entry"><div class="row"><span class="bold">${e.degree}${e.school ? ` · ${e.school}` : ''}</span><span class="date">${e.endDate || ''}</span></div>${e.gpa ? `<div class="sub">GPA: ${e.gpa}</div>` : ''}</div>`).join('')}</div>` : ''}
  ${skills.some(s => s.items) ? `<div class="sec"><div class="st">Core Competencies</div><div>${skills.flatMap(s => s.items.split(',')).map(i => i.trim()).filter(Boolean).map(s => `<span class="chip">${s}</span>`).join('')}</div></div>` : ''}
  ${projects.some(pr => pr.name) ? `<div class="sec"><div class="st">Notable Projects</div>${projects.filter(pr => pr.name).map(pr => `<div class="entry"><div class="row"><span class="bold">${pr.name}</span>${pr.url ? `<span style="font-size:8.5pt;color:#1a56db">${pr.url}</span>` : ''}</div>${pr.tech ? `<div class="sub">${pr.tech}</div>` : ''}${pr.description ? `<p style="font-size:8.5pt;margin-top:2px">${pr.description}</p>` : ''}</div>`).join('')}</div>` : ''}
</div>
</body></html>`
  }

  // Startup template
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${base}<style>
body{font-family:Arial,sans-serif;font-size:9.5pt;line-height:1.3;padding:24px 36px;color:#111;background:#fff}
.name{font-size:18pt;font-weight:900;letter-spacing:-0.5px}
.title{font-size:9.5pt;color:#555;margin:2px 0 6px}
.contact{display:flex;flex-wrap:wrap;gap:8px;font-size:8.5pt;color:#555;margin-bottom:14px}
.sec{margin-bottom:12px}
.st{font-size:8.5pt;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#555;margin-bottom:3px}
hr{border:none;border-top:1px solid #e5e7eb;margin-bottom:6px}
.entry{margin-bottom:7px}
.row{display:flex;justify-content:space-between}
.bold{font-weight:bold}.sub{font-size:8.5pt;color:#64748b}
.date{font-size:8.5pt;color:#888;white-space:nowrap}
ul{padding-left:14px;margin-top:2px}li{font-size:8.5pt;margin-bottom:1px}
.tag{display:inline-block;background:#f3f4f6;border-radius:3px;padding:1px 6px;margin:1px;font-size:8pt}
</style></head><body>
<div class="name">${p.name || 'Your Name'}</div>
${p.title ? `<div class="title">${p.title}</div>` : ''}
<div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).map(v => `<span>${v}</span>`).join('')}</div>
${summary ? `<div class="sec"><div class="st">About</div><hr/><p>${summary}</p></div>` : ''}
${experience.some(e => e.title) ? `<div class="sec"><div class="st">Experience</div><hr/>${experience.filter(e => e.title).map(e => `<div class="entry"><div class="row"><span class="bold">${e.title}${e.company ? ` · ${e.company}` : ''}</span><span class="date">${e.startDate || ''}${e.current ? ' – Present' : e.endDate ? ` – ${e.endDate}` : ''}</span></div>${e.location ? `<div class="sub">${e.location}</div>` : ''}${e.bullets ? `<ul>${e.bullets.split('\n').filter(Boolean).map(b => `<li>${b.replace(/^[-•]\s*/, '')}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : ''}
${projects.some(pr => pr.name) ? `<div class="sec"><div class="st">Projects</div><hr/>${projects.filter(pr => pr.name).map(pr => `<div class="entry"><div class="row"><span class="bold">${pr.name}</span>${pr.url ? `<span style="font-size:8.5pt;color:#1a56db">${pr.url}</span>` : ''}</div>${pr.tech ? `<div class="sub">${pr.tech}</div>` : ''}${pr.description ? `<p style="font-size:8.5pt;margin-top:2px">${pr.description}</p>` : ''}</div>`).join('')}</div>` : ''}
${skills.some(s => s.items) ? `<div class="sec"><div class="st">Skills</div><hr/>${skills.filter(s => s.items).map(s => `<div>${s.category ? `<span style="font-size:8.5pt;color:#555">${s.category}: </span>` : ''}${s.items.split(',').map(i => `<span class="tag">${i.trim()}</span>`).join('')}</div>`).join('')}</div>` : ''}
${education.some(e => e.degree) ? `<div class="sec"><div class="st">Education</div><hr/>${education.filter(e => e.degree).map(e => `<div class="entry"><div class="row"><span class="bold">${e.degree}${e.school ? ` · ${e.school}` : ''}</span><span class="date">${e.endDate || ''}</span></div>${e.gpa ? `<div class="sub">GPA: ${e.gpa}</div>` : ''}</div>`).join('')}</div>` : ''}
</body></html>`
}

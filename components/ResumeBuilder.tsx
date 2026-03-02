"use client"

import { useState, useCallback } from 'react'
import { buildResumeHTML } from '@/lib/resume-html'
import type { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry, CertificationEntry } from '@/lib/resume-html'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Download,
    Plus,
    Trash2,
    Eye,
    Edit3,
    FileUser,
    Sparkles,
    ChevronDown,
    ChevronUp,
    CheckCircle,
} from 'lucide-react'



const uid = () => Math.random().toString(36).slice(2)

const TEMPLATES = [
    { id: 'classic', name: 'Classic', desc: 'Timeless serif layout', color: 'from-slate-500 to-slate-700', preview: '📄' },
    { id: 'modern', name: 'Modern', desc: 'Dark sidebar + clean body', color: 'from-electric-blue to-cyan-500', preview: '🎨' },
    { id: 'executive', name: 'Executive', desc: 'Bold header, leadership focus', color: 'from-neon-orange to-amber-500', preview: '👔' },
    { id: 'startup', name: 'Startup', desc: 'Minimal, tech-founder style', color: 'from-electric-violet to-purple-500', preview: '🚀' },
]

const EMPTY: ResumeData = {
    personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
    summary: '',
    experience: [{ id: uid(), title: '', company: '', companyUrl: '', location: '', startDate: '', endDate: '', current: false, bullets: '' }],
    education: [{ id: uid(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '' }],
    skills: [
        { id: uid(), category: 'Languages', items: '' },
        { id: uid(), category: 'Frameworks', items: '' },
        { id: uid(), category: 'Tools', items: '' },
        { id: uid(), category: 'Platforms', items: '' },
        { id: uid(), category: 'Soft Skills', items: '' },
    ],
    projects: [],
    certifications: [],
}

const SAMPLE: ResumeData = {
    personal: {
        name: 'Vijeet Shah',
        title: 'Lead Software Engineer',
        email: 'vijeetshah@vijeetshah.com',
        phone: '+91 9082053880',
        location: 'Mumbai, India',
        linkedin: 'linkedin.com/in/vijeet-shah',
        github: 'github.com/vijeetshah',
        website: 'www.vijeetshah.com',
    },
    summary: 'Results-driven Software Engineer with 4+ years of experience building scalable web applications and leading cross-functional teams at MNCs and high-growth startups. Proven track record in full-stack development (Next.js, React, Node.js, TypeScript), team leadership, and product strategy. Co-founded two ventures and contributed to securing $1M in funding. Passionate about bridging people and technology to deliver impactful, production-grade solutions.',
    experience: [
        {
            id: 'smp-exp-1',
            title: 'Lead Software Engineer',
            company: 'Service Plus Connect',
            companyUrl: 'serviceplus.com',
            location: 'Mumbai, India',
            startDate: 'March 2024',
            endDate: 'February 2025',
            current: false,
            bullets: `Architected and delivered end-to-end web applications from wireframes to production using Next.js, TypeScript, React, and Node.js, resulting in a scalable platform serving 10,000+ users
Led development of a comprehensive admin panel and opt-in authentication system using MERN stack, ensuring robust data privacy and compliance
Established CI/CD deployment pipelines for API and frontend applications using AWS services, reducing deployment time by 40%
Recruited, interviewed, and mentored a high-performing team of 8 developers, business analysts, and project managers
Co-developed investment presentations articulating technical vision and product strategy, directly contributing to securing $1M in funding for company expansion`,
        },
        {
            id: 'smp-exp-2',
            title: 'Product Manager',
            company: 'Pairing',
            companyUrl: '',
            location: 'Remote',
            startDate: 'January 2024',
            endDate: 'December 2024',
            current: false,
            bullets: `Orchestrated project timelines, budgets, and deliverables, collaborating with C-level executives to ensure alignment with strategic business goals
Translated complex business requirements into actionable technical specifications, enabling engineering teams to deliver on time and within budget
Implemented project lifecycle management tools (Jira), streamlining workflows and improving cross-functional team productivity by 20%`,
        },
        {
            id: 'smp-exp-3',
            title: 'Software Engineer',
            company: 'AdsLibrary',
            companyUrl: '',
            location: 'Mumbai, India',
            startDate: 'September 2023',
            endDate: 'December 2023',
            current: false,
            bullets: `Developed and maintained critical software components for advertising platforms using React and Node.js, enhancing platform performance by 25%
Led design and implementation of a Chrome extension for ad library functionality, increasing user engagement by 15% within the first quarter`,
        },
        {
            id: 'smp-exp-4',
            title: 'Software Engineer',
            company: 'eClinicalWorks',
            companyUrl: 'eclinicalworks.com',
            location: 'Mumbai, India',
            startDate: 'October 2021',
            endDate: 'September 2023',
            current: false,
            bullets: `Designed and implemented 30+ clinical interfaces for hospitals, vendors, and healthcare firms, improving data exchange efficiency by 30% across integrated systems
Built scalable SaaS backend systems using MSSQL and MySQL, ensuring robust performance for healthcare applications serving 10,000+ patient records
Resolved 350+ critical issues, maintaining 99.9% system uptime for mission-critical healthcare platforms
Implemented advanced encryption measures and ensured HIPAA compliance, safeguarding sensitive data for patient records`,
        },
    ],
    education: [
        {
            id: 'smp-edu-1',
            degree: 'Master of Science in Information Technology',
            school: 'University of Mumbai',
            location: 'Mumbai, India',
            startDate: '2021',
            endDate: '2023',
            gpa: '',
        },
        {
            id: 'smp-edu-2',
            degree: 'Bachelor of Science in Information Technology',
            school: 'Thakur College of Science & Commerce',
            location: 'Mumbai, India',
            startDate: '2018',
            endDate: '2021',
            gpa: '',
        },
    ],
    skills: [
        { id: 'smp-sk-1', category: 'Languages', items: 'JavaScript, TypeScript, Python, Java, SQL' },
        { id: 'smp-sk-2', category: 'Frameworks', items: 'React, Next.js, Node.js, Express.js, React Native' },
        { id: 'smp-sk-3', category: 'Tools', items: 'AWS, Docker, Kubernetes, CI/CD, GitHub, GitLab, Postman, JIRA, Linear' },
        { id: 'smp-sk-4', category: 'Platforms', items: 'MongoDB, MySQL, MSSQL, Vercel, Notion, Confluence, Asana' },
        { id: 'smp-sk-5', category: 'Soft Skills', items: 'Team Leadership, System Architecture, API Design (REST, GraphQL), Product Strategy, Agile/Scrum' },
    ],
    projects: [
        {
            id: 'smp-pr-1',
            name: 'LoopXo — Digital Software Agency',
            url: 'loopxo.com',
            tech: 'Next.js, React, Node.js, React Native, AWS, CI/CD',
            description: `Founded and scaled a digital agency delivering 10+ web and mobile applications with 95% client satisfaction
Led full-stack development across client projects, reducing average deployment time by 35% through optimized CI/CD pipelines
Built cross-platform mobile applications using React Native, serving clients in fintech and e-commerce verticals`,
            startDate: '2023',
            endDate: 'Present',
        },
        {
            id: 'smp-pr-2',
            name: 'Growtechie — EdTech Platform',
            url: '',
            tech: 'React, Node.js, MongoDB, AWS',
            description: `Co-founded an e-learning platform using React and Node.js, serving thousands of learners across India
Delivered keynote presentations at college events, boosting platform adoption by 40% among student communities
Enhanced platform features based on user feedback, improving course completion rates by 25%`,
            startDate: '2022',
            endDate: '2023',
        },
    ],
    certifications: [
        {
            id: 'smp-cert-1',
            name: 'AWS Certified Developer – Associate',
            provider: 'Amazon Web Services',
            url: 'aws.amazon.com/certification',
            date: 'March 2024',
            bullets: `Mastered cloud architecture, Lambda functions, EC2, S3, and serverless deployment pipelines
Applied AWS services in production environments for CI/CD automation and scalable backend infrastructure`,
        },
        {
            id: 'smp-cert-2',
            name: 'Professional Scrum Master I (PSM I)',
            provider: 'Scrum.org',
            url: 'scrum.org/certificates',
            date: 'January 2023',
            bullets: `Mastered Agile frameworks, sprint planning, backlog refinement, and retrospectives for cross-functional teams
Applied Scrum methodology to lead 8-person engineering team at Service Plus Connect, improving sprint velocity by 30%`,
        },
    ],
}


// ─────────────────────────── Input helpers ───────────────────────────
function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || label}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
            />
        </div>
    )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || label}
                rows={rows}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all resize-none"
            />
        </div>
    )
}

// ─────────────────────────── Collapsible Section ───────────────────────────
function Section({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-electric-blue">{icon}</div>
                    <span className="font-bold text-white text-sm">{title}</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
        </div>
    )
}

// ─────────────────────────── Main Component ───────────────────────────
export default function ResumeBuilder() {
    const [data, setData] = useState<ResumeData>(EMPTY)
    const [template, setTemplate] = useState('classic')
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
    const [downloading, setDownloading] = useState(false)
    const [downloadMsg, setDownloadMsg] = useState('')

    const updatePersonal = (field: keyof PersonalInfo, value: string) =>
        setData(d => ({ ...d, personal: { ...d.personal, [field]: value } }))

    const updateExp = (id: string, field: keyof ExperienceEntry, value: string | boolean) =>
        setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }))

    const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: uid(), title: '', company: '', companyUrl: '', location: '', startDate: '', endDate: '', current: false, bullets: '' }] }))
    const removeExp = (id: string) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }))

    const updateEdu = (id: string, field: keyof EducationEntry, value: string) =>
        setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e) }))

    const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: uid(), degree: '', school: '', location: '', startDate: '', endDate: '', gpa: '' }] }))
    const removeEdu = (id: string) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }))

    const updateSkill = (id: string, field: keyof SkillEntry, value: string) =>
        setData(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }))

    const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, { id: uid(), category: '', items: '' }] }))
    const removeSkill = (id: string) => setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }))

    const updateProject = (id: string, field: keyof ProjectEntry, value: string) =>
        setData(d => ({ ...d, projects: d.projects.map(pr => pr.id === id ? { ...pr, [field]: value } : pr) }))

    const addProject = () => setData(d => ({ ...d, projects: [...d.projects, { id: uid(), name: '', url: '', tech: '', description: '', startDate: '', endDate: '' }] }))
    const removeProject = (id: string) => setData(d => ({ ...d, projects: d.projects.filter(pr => pr.id !== id) }))

    const updateCert = (id: string, field: keyof CertificationEntry, value: string) =>
        setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) }))

    const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, { id: uid(), name: '', provider: '', url: '', date: '', bullets: '' }] }))
    const removeCert = (id: string) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }))

    const previewHTML = useCallback(() => buildResumeHTML(data, template), [data, template])

    const handleDownload = async () => {
        setDownloading(true)
        setDownloadMsg('')
        try {
            const res = await fetch('/api/resume-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data, template }),
            })

            const isFallback = res.headers.get('X-PDF-Fallback') === 'true'

            if (isFallback) {
                // Open HTML in new tab and tell user to print
                const html = await res.text()
                const blob = new Blob([html], { type: 'text/html' })
                const url = URL.createObjectURL(blob)
                const win = window.open(url, '_blank')
                if (win) {
                    win.onload = () => {
                        setTimeout(() => win.print(), 500)
                    }
                }
                setDownloadMsg('Use browser Print → Save as PDF')
            } else if (res.ok) {
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'founder-resume.pdf'
                a.click()
                URL.revokeObjectURL(url)
                setDownloadMsg('Downloaded!')
            } else {
                throw new Error('Failed')
            }
        } catch {
            setDownloadMsg('Error — try again')
        } finally {
            setDownloading(false)
            setTimeout(() => setDownloadMsg(''), 4000)
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <FileUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">RÉSUMÉ FORGE</h1>
                        <p className="text-slate-400 text-sm">100% ATS-Friendly Founder Resume Builder</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold">✓ ATS Optimized</Badge>
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 font-bold">✓ 4 Templates</Badge>
                    <Badge className="bg-electric-violet/20 text-electric-violet border-electric-violet/30 font-bold">✓ PDF Export</Badge>
                    <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/30 font-bold">✓ Live Preview</Badge>
                </div>
                {/* Sample Pre-fill Banner */}
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/25">
                    <div className="text-2xl">🎯</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-amber-400 font-bold text-sm">See a 100% ATS-perfect resume in action</p>
                        <p className="text-slate-400 text-xs mt-0.5">Load a real sample — read it, learn the format, then replace with your own data.</p>
                    </div>
                    <button
                        onClick={() => setData(SAMPLE)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
                    >
                        <Sparkles className="w-4 h-4" />
                        Load Sample
                    </button>
                    <button
                        onClick={() => setData(EMPTY)}
                        title="Clear all fields"
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-300 font-semibold text-sm transition-all"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Template Selector */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Choose Template</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:scale-[1.02] ${template === t.id
                                ? 'border-electric-blue bg-electric-blue/10 shadow-lg shadow-electric-blue/20'
                                : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                                }`}
                        >
                            {template === t.id && (
                                <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-electric-blue" />
                            )}
                            <div className="text-2xl mb-2">{t.preview}</div>
                            <div className={`text-sm font-black bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{t.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile tabs */}
            <div className="flex md:hidden gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'edit' ? 'bg-electric-blue text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                    <Edit3 className="w-4 h-4" /> Editor
                </button>
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'preview' ? 'bg-electric-blue text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                    <Eye className="w-4 h-4" /> Preview
                </button>
            </div>

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ── Left: Form ── */}
                <div className={`space-y-4 ${activeTab === 'preview' ? 'hidden md:block' : ''}`}>

                    {/* Personal Info */}
                    <Section title="Personal Information" icon={<FileUser className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input label="Full Name" value={data.personal.name} onChange={v => updatePersonal('name', v)} placeholder="Jane Doe" />
                            <Input label="Professional Title" value={data.personal.title} onChange={v => updatePersonal('title', v)} placeholder="Data Analyst | Founder" />
                            <Input label="Email" value={data.personal.email} onChange={v => updatePersonal('email', v)} placeholder="jane@startup.com" type="email" />
                            <Input label="Phone" value={data.personal.phone} onChange={v => updatePersonal('phone', v)} placeholder="+1 (555) 000-0000" />
                            <Input label="Location" value={data.personal.location} onChange={v => updatePersonal('location', v)} placeholder="San Francisco, CA" />
                            <Input label="LinkedIn URL" value={data.personal.linkedin} onChange={v => updatePersonal('linkedin', v)} placeholder="linkedin.com/in/jane" />
                            <Input label="GitHub URL (optional)" value={data.personal.github} onChange={v => updatePersonal('github', v)} placeholder="github.com/jane" />
                            <Input label="Website / Portfolio" value={data.personal.website} onChange={v => updatePersonal('website', v)} placeholder="janedoe.com" />
                        </div>
                    </Section>

                    {/* Summary */}
                    <Section title="Professional Summary" icon={<Sparkles className="w-4 h-4" />}>
                        <Textarea
                            label="Summary"
                            value={data.summary}
                            onChange={v => setData(d => ({ ...d, summary: v }))}
                            placeholder="Founder with 5+ years building and scaling B2B SaaS products. Led $2M pre-seed round, 0→1 to 1000+ customers. Passionate about product-led growth and building high-performing remote teams."
                            rows={4}
                        />
                        <p className="text-xs text-slate-500">Tip: Keep it 2–4 sentences. Lead with impact, not job description.</p>
                    </Section>

                    {/* Experience */}
                    <Section title="Work Experience" icon={<Edit3 className="w-4 h-4" />}>
                        {data.experience.map((exp, i) => (
                            <div key={exp.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Experience #{i + 1}</span>
                                    {data.experience.length > 1 && (
                                        <button onClick={() => removeExp(exp.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input label="Job Title" value={exp.title} onChange={v => updateExp(exp.id, 'title', v)} placeholder="Data Analyst" />
                                    <Input label="Company Name" value={exp.company} onChange={v => updateExp(exp.id, 'company', v)} placeholder="AcmeCorp" />
                                    <div className="sm:col-span-2">
                                        <Input label="Company URL (optional)" value={exp.companyUrl} onChange={v => updateExp(exp.id, 'companyUrl', v)} placeholder="acmecorp.com" />
                                    </div>
                                    <Input label="Start Date" value={exp.startDate} onChange={v => updateExp(exp.id, 'startDate', v)} placeholder="Jan 2022" />
                                    <div className="flex flex-col gap-1">
                                        <Input label="End Date" value={exp.endDate} onChange={v => updateExp(exp.id, 'endDate', v)} placeholder="Present" />
                                        <label className="flex items-center gap-2 text-xs text-slate-400 mt-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={exp.current}
                                                onChange={e => updateExp(exp.id, 'current', e.target.checked)}
                                                className="accent-electric-blue"
                                            />
                                            Currently working here
                                        </label>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Input label="Location" value={exp.location} onChange={v => updateExp(exp.id, 'location', v)} placeholder="San Francisco, CA" />
                                    </div>
                                </div>
                                <Textarea
                                    label="Achievement Bullets (one per line, start with action verb)"
                                    value={exp.bullets}
                                    onChange={v => updateExp(exp.id, 'bullets', v)}
                                    placeholder={`- Increased revenue by 42% in Q2 by building automated reporting pipeline\n- Led cross-functional team of 8 to deliver product 3 weeks ahead of schedule\n- Reduced customer churn by 35% through proactive CS program`}
                                    rows={4}
                                />
                                <p className="text-xs text-slate-500">Tip: Start each bullet with an action verb. Include numbers/% for impact.</p>
                            </div>
                        ))}
                        <button
                            onClick={addExp}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-600 text-slate-400 hover:border-electric-blue hover:text-electric-blue transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Experience
                        </button>
                    </Section>

                    {/* Education */}
                    <Section title="Education" icon={<CheckCircle className="w-4 h-4" />} defaultOpen={false}>
                        {data.education.map((edu, i) => (
                            <div key={edu.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Education #{i + 1}</span>
                                    {data.education.length > 1 && (
                                        <button onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2">
                                        <Input label="Degree / Certification" value={edu.degree} onChange={v => updateEdu(edu.id, 'degree', v)} placeholder="B.S. Computer Science" />
                                    </div>
                                    <Input label="School / Institution" value={edu.school} onChange={v => updateEdu(edu.id, 'school', v)} placeholder="Stanford University" />
                                    <Input label="Location (City, Country)" value={edu.location} onChange={v => updateEdu(edu.id, 'location', v)} placeholder="Stanford, USA" />
                                    <Input label="Start Date" value={edu.startDate} onChange={v => updateEdu(edu.id, 'startDate', v)} placeholder="Aug 2016" />
                                    <Input label="End Date" value={edu.endDate} onChange={v => updateEdu(edu.id, 'endDate', v)} placeholder="May 2020" />
                                    <Input label="GPA (optional)" value={edu.gpa} onChange={v => updateEdu(edu.id, 'gpa', v)} placeholder="3.8 / 4.0" />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addEdu}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-600 text-slate-400 hover:border-electric-blue hover:text-electric-blue transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Education
                        </button>
                    </Section>

                    {/* Skills */}
                    <Section title="Skills" icon={<Sparkles className="w-4 h-4" />} defaultOpen={false}>
                        <p className="text-xs text-slate-500 -mt-2">Group skills by category. Use commas to separate items.</p>
                        {data.skills.map((sk) => (
                            <div key={sk.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                <Input label="Category (optional)" value={sk.category} onChange={v => updateSkill(sk.id, 'category', v)} placeholder="Technical" />
                                <div className="sm:col-span-2 relative">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Skills (comma-separated)</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={sk.items}
                                            onChange={e => updateSkill(sk.id, 'items', e.target.value)}
                                            placeholder="React, TypeScript, AWS, Figma"
                                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
                                        />
                                        {data.skills.length > 1 && (
                                            <button onClick={() => removeSkill(sk.id)} className="text-red-400 hover:text-red-300 px-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addSkill}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-600 text-slate-400 hover:border-electric-blue hover:text-electric-blue transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Skill Group
                        </button>
                    </Section>

                    {/* Projects */}
                    <Section title="Projects" icon={<Sparkles className="w-4 h-4" />} defaultOpen={false}>
                        {data.projects.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-2">No projects yet — add side projects, products, or research you&apos;ve built.</p>
                        )}
                        {data.projects.map((pr, i) => (
                            <div key={pr.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Project #{i + 1}</span>
                                    <button onClick={() => removeProject(pr.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input label="Project Name" value={pr.name} onChange={v => updateProject(pr.id, 'name', v)} placeholder="Sentiment Analyzer" />
                                    <Input label="Project URL (optional)" value={pr.url} onChange={v => updateProject(pr.id, 'url', v)} placeholder="github.com/jane/sentiment" />
                                    <Input label="Start Date" value={pr.startDate} onChange={v => updateProject(pr.id, 'startDate', v)} placeholder="Jan 2024" />
                                    <Input label="End Date" value={pr.endDate} onChange={v => updateProject(pr.id, 'endDate', v)} placeholder="Mar 2024" />
                                    <div className="sm:col-span-2">
                                        <Input label="Tech Stack" value={pr.tech} onChange={v => updateProject(pr.id, 'tech', v)} placeholder="Python, BERT, Scikit-learn, Streamlit" />
                                    </div>
                                </div>
                                <Textarea
                                    label="Impact Bullets (one per line)"
                                    value={pr.description}
                                    onChange={v => updateProject(pr.id, 'description', v)}
                                    placeholder={`- Built NLP model using BERT achieving 94.2% accuracy on 50K reviews\n- Deployed Streamlit dashboard used by 200+ analysts\n- Reduced manual review time by 60%`}
                                    rows={3}
                                />
                            </div>
                        ))}
                        <button
                            onClick={addProject}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-600 text-slate-400 hover:border-electric-blue hover:text-electric-blue transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </button>
                    </Section>

                    {/* Certifications */}
                    <Section title="Certifications" icon={<CheckCircle className="w-4 h-4" />} defaultOpen={false}>
                        {data.certifications.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-2">Add certifications from Coursera, Google, AWS, Microsoft, etc.</p>
                        )}
                        {data.certifications.map((c, i) => (
                            <div key={c.id} className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Certification #{i + 1}</span>
                                    <button onClick={() => removeCert(c.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="sm:col-span-2">
                                        <Input label="Certification Name" value={c.name} onChange={v => updateCert(c.id, 'name', v)} placeholder="Google Data Analytics Professional Certificate" />
                                    </div>
                                    <Input label="Issuing Provider" value={c.provider} onChange={v => updateCert(c.id, 'provider', v)} placeholder="Google / Coursera" />
                                    <Input label="Date" value={c.date} onChange={v => updateCert(c.id, 'date', v)} placeholder="Mar 2024" />
                                    <div className="sm:col-span-2">
                                        <Input label="Certificate URL (optional)" value={c.url} onChange={v => updateCert(c.id, 'url', v)} placeholder="coursera.org/verify/XXXXX" />
                                    </div>
                                </div>
                                <Textarea
                                    label="Skills / Learnings (one per line)"
                                    value={c.bullets}
                                    onChange={v => updateCert(c.id, 'bullets', v)}
                                    placeholder={`- Mastered SQL, R, and Tableau for data analysis\n- Completed 8-course specialization with 200+ hours of content\n- Built 6 real-world data projects as capstone`}
                                    rows={3}
                                />
                            </div>
                        ))}
                        <button
                            onClick={addCert}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-600 text-slate-400 hover:border-electric-blue hover:text-electric-blue transition-colors text-sm font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Certification
                        </button>
                    </Section>

                    {/* Download Button (bottom of form) */}
                    <div className="flex gap-3 sticky bottom-4 z-10">
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all py-6 text-base"
                        >
                            {downloading ? (
                                <span className="animate-pulse">Generating PDF…</span>
                            ) : (
                                <><Download className="w-5 h-5 mr-2" /> Download PDF</>
                            )}
                        </Button>
                    </div>
                    {downloadMsg && (
                        <p className="text-center text-sm font-semibold text-emerald-400">{downloadMsg}</p>
                    )}
                </div>

                {/* ── Right: Preview ── */}
                <div className={`${activeTab === 'edit' ? 'hidden md:flex' : 'flex'} flex-col`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-electric-blue" />
                            <span className="text-sm font-bold text-white">Live Preview</span>
                            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                                {TEMPLATES.find(t => t.id === template)?.name}
                            </Badge>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold hidden md:flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {downloading ? 'Generating…' : 'Download PDF'}
                        </Button>
                    </div>

                    {/* Resume preview iframe */}
                    <div className="flex-1 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-white" style={{ minHeight: '800px' }}>
                        <iframe
                            srcDoc={previewHTML()}
                            className="w-full h-full"
                            style={{ minHeight: '800px', border: 'none', background: 'white' }}
                            title="Resume Preview"
                        />
                    </div>

                    {/* ATS Tips */}
                    <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">✓ ATS Optimization Tips</p>
                        <ul className="space-y-1 text-xs text-slate-400">
                            <li>• Use standard section titles (Experience, Education, Skills)</li>
                            <li>• Include keywords from the job description in your bullets</li>
                            <li>• Quantify achievements: 📈 numbers, %, $, time saved</li>
                            <li>• Avoid graphics, tables, and columns (ATS can&apos;t read them)</li>
                            <li>• Keep file size under 2MB for best ATS compatibility</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

import DashboardLayout from '@/components/DashboardLayout'
import ResumeBuilder from '@/components/ResumeBuilder'

export const metadata = {
  title: 'Resume Forge – ATS-Friendly Resume Builder | FounderBox',
  description: 'Build a 100% ATS-optimized resume as a founder. Choose from 4 professional templates, fill in your details, and download a perfect PDF instantly.',
}

export default function ResumePage() {
  return (
    <DashboardLayout>
      <ResumeBuilder />
    </DashboardLayout>
  )
}

import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FounderBox — Accountability OS for Solo Operators",
  description:
    "FounderBox shows what you actually did today: revenue attempts, shipped outputs, outreach experiments, work sessions, product progress, and weekly proof reports.",
  alternates: {
    canonical: "https://founderbox.loopxo.org",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://founderbox.loopxo.org/#organization",
      name: "Loopxo",
      url: "https://loopxo.org",
      logo: "https://founderbox.loopxo.org/logo.png",
      founder: {
        "@type": "Person",
        name: "Vijeet Shah",
      },
      sameAs: [
        "https://loopxo.org",
        "https://github.com/Loopxo/founder-box",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://founderbox.loopxo.org/#software",
      name: "FounderBox",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "8",
        priceCurrency: "USD",
      },
      description:
        "Solo-operator accountability OS with founder tools and MCP access.",
      author: {
        "@type": "Organization",
        name: "Loopxo",
        url: "https://loopxo.org",
      },
      featureList: [
        "Daily Check-ins",
        "Outreach Log",
        "Work Sessions",
        "Product Progress",
        "Methods Library",
        "Weekly Proof Reports",
        "Proposal Generator",
        "Contract Templates",
        "Invoice Generator",
        "Cold Email Templates",
        "Resume Builder",
        "SEO Content Generator",
        "Sales Copy Generator",
        "Social Media Content",
        "Competitive Analysis",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://founderbox.loopxo.org/#website",
      url: "https://founderbox.loopxo.org",
      name: "FounderBox",
      publisher: {
        "@id": "https://founderbox.loopxo.org/#organization",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://founderbox.loopxo.org/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is FounderBox free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FounderBox has a free plan and a founding Pro plan at $8/month. Hosted usage has fair-use limits while self-hosting can be configured separately.",
          },
        },
        {
          "@type": "Question",
          name: "What does FounderBox track?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FounderBox tracks daily check-ins, leads, outreach logs, methods, work sessions, product progress, proof assets, reviews, and weekly reports.",
          },
        },
        {
          "@type": "Question",
          name: "Who built FounderBox?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FounderBox is built and maintained by Loopxo, a digital agency founded by Vijeet Shah. It is open source and community-driven.",
          },
        },
        {
          "@type": "Question",
          name: "How is FounderBox different from paid tools like Proposify or FreshBooks?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unlike paid alternatives that charge $20-100+ per month for a single tool, FounderBox bundles 9+ professional tools into one free platform. It is open source, so you can self-host, customize, and own your data.",
          },
        },
        {
          "@type": "Question",
          name: "Can I self-host FounderBox?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. FounderBox is built with Next.js and can be deployed to Vercel, Netlify, Railway, or any platform that supports Node.js. Clone the repo and deploy in minutes.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="w-full bg-[#111118]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </main>
  );
}

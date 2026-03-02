import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://founderbox.loopxo.org"),
  title: {
    default: "FounderBox — Free Open Source Toolkit for Founders | Proposals, Invoices & Contracts",
    template: "%s | FounderBox by Loopxo",
  },
  description:
    "FounderBox is a free, open source suite of business tools for founders and agencies. Generate proposals, contracts, invoices, cold emails, resumes, and sales copy — all in one place. Built by Loopxo.",
  keywords: [
    "founder tools",
    "free proposal generator",
    "invoice generator",
    "contract templates",
    "cold email templates",
    "startup toolkit",
    "open source business tools",
    "freelancer tools",
    "agency toolkit",
    "FounderBox",
    "Loopxo",
    "Vijeet Shah",
    "free invoicing software",
    "proposal builder",
    "resume builder",
    "sales copy generator",
    "competitive analysis tool",
  ],
  authors: [
    { name: "Vijeet Shah", url: "https://loopxo.org" },
    { name: "Loopxo", url: "https://loopxo.org" },
  ],
  creator: "Loopxo",
  publisher: "Loopxo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://founderbox.loopxo.org",
    siteName: "FounderBox",
    title: "FounderBox — Free Open Source Toolkit for Founders",
    description:
      "Stop juggling 10 different tools. FounderBox gives you proposals, contracts, invoices, cold emails, and more — free forever. An open source project by Loopxo.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FounderBox — Free Open Source Toolkit for Founders | Proposals, Invoices & Contracts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FounderBox — Free Open Source Toolkit for Founders",
    description:
      "Proposals, contracts, invoices, cold emails, and more — free forever. Built by Loopxo.",
    images: ["/og-image.png"],
    creator: "@loopxo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://founderbox.loopxo.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

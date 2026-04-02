import type { Metadata } from "next";
import { Bodoni_Moda, Hubot_Sans, Instrument_Serif } from "next/font/google";
import Navbar from "@/components/navbar";
import Terminal from "@/components/terminal";
import Footer from "@/components/footer";
import ChatBubble from "@/components/home/chat-bubble";
import { siteMetadata, siteConfig } from "@/config/siteConfig";
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider, PostHogPageView } from "@posthog/next";
import { Suspense, type ReactNode } from "react";
import { user } from "@/data/general";
import { experiences } from "@/data/experience";
import { Providers } from "@/providers";
import "./globals.css";

const hubotSans = Hubot_Sans({
  variable: "--font-hubot-sans",
  subsets: ["latin"],
});


const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = siteMetadata;

/**
 * PostHog is optional for forks: set NEXT_PUBLIC_POSTHOG_KEY in `.env.local` when you want analytics.
 * If unset or empty, the app runs without PostHog (no @posthog/next apiKey error).
 */
function isPostHogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    jobTitle: experiences[experiences.length - 1]?.roles[0]?.title,
    description: siteConfig.description,
    url: siteConfig.url,
    sameAs: [
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
      siteConfig.links.github,
    ],
    worksFor: {
      "@type": "Organization",
      name: experiences[experiences.length - 1]?.company,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: user.location,
      addressCountry: user.location.split(",")[1].trim(),
      postalCode: user.postalCode,
    },
  };

  const posthogEnabled = isPostHogEnabled();

  // Shared UI tree; PostHogProvider only wraps this when a project API key is set.
  const appContent: ReactNode = (
    <Providers>
      {posthogEnabled && (
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
      )}
      <Navbar />
      {children}
      <Footer />
      <Terminal />
      {/* <ChatBubble /> */}
      <Analytics />
    </Providers>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${hubotSans.variable} ${bodoni.variable} ${instrumentSerif.variable} antialiased`}>
        {posthogEnabled ? (
          <PostHogProvider
            clientOptions={{ api_host: "/ingest", custom_campaign_params: ["ref"] }}
          >
            {appContent}
          </PostHogProvider>
        ) : (
          appContent
        )}
      </body>
    </html>
  );
}

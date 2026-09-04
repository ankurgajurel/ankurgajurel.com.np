import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Terminal from "@/components/terminal";
import Footer from "@/components/footer";
import RoundedSelection from "@/components/portfolio/rounded-selection";
import { siteMetadata } from "@/config/siteConfig";
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider, PostHogPageView } from "@posthog/next";
import { Suspense } from "react";
import { Providers } from "@/providers";
import { getPersonJsonLd, getWebsiteJsonLd, jsonLdGraph } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = jsonLdGraph([getPersonJsonLd(), getWebsiteJsonLd()]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} flex min-h-dvh flex-col bg-background font-sans text-[15px] leading-[1.65] tracking-[-0.018em] text-foreground lowercase antialiased`}
      >
        <PostHogProvider
          clientOptions={{
            api_host: "/ingest",
            custom_campaign_params: ["ref"],
          }}
        >
          <Providers>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <RoundedSelection />
            <Navbar />
            <div className="min-w-0 flex-[1_0_auto]">{children}</div>
            <Footer />
            <Terminal />

            <Analytics />
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}

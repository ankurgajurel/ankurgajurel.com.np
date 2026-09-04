import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import LazyTerminal from "@/components/lazy-terminal";
import Footer from "@/components/footer";
import RoundedSelection from "@/components/portfolio/rounded-selection";
import { siteMetadata } from "@/config/siteConfig";
import { Analytics } from "@vercel/analytics/react";
import PostHogAnalytics from "@/providers/analytics";
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
        <Providers>
          <RoundedSelection />
          <Navbar />
          <div className="min-w-0 flex-[1_0_auto]">{children}</div>
          <Footer />
          <LazyTerminal />
          <Analytics />
          <PostHogAnalytics />
        </Providers>
      </body>
    </html>
  );
}

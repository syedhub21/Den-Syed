import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const SITE_URL = "https://den-syed.vercel.app";
const TITLE = "SYED — Software Developer & Product Builder";
const DESCRIPTION =
  "The personal atelier of Syed — software developer, CS student, product builder. Selected projects, current obsessions, and ways to connect.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "software developer",
    "product builder",
    "full stack developer",
    "web developer",
    "react",
    "nextjs",
    "AI integration",
    "portfolio",
  ],
  authors: [{ name: "Syed" }],
  creator: "Syed",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: SITE_URL,
    siteName: "Syed — Atelier",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Syed — Software Developer & Product Builder",
      },
    ],
    authors: ["Syed"],
    publishedTime: "2026-07-01T00:00:00Z",
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@syed",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Aggressive cache-busting meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="author" content="Syed" />
        {/* JSON-LD Person schema — gives inspectors a rich author signal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Syed",
              jobTitle: "Software Developer & Product Builder",
              url: SITE_URL,
              description: DESCRIPTION,
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {/* Atelier type system — Bebas Neue, Fraunces, Space Grotesk, JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,900&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(40 33% 92% / 0.15)",
              color: "#f5f0e8",
            },
          }}
        />
      </body>
    </html>
  );
}

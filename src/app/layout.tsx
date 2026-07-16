import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio — Developer & Designer",
  description:
    "Frontend developer and CS student. Turning ideas into smooth, functional digital experiences.",
  keywords: [
    "portfolio",
    "frontend developer",
    "web developer",
    "react",
    "UI design",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Portfolio — Developer & Designer",
    description:
      "Frontend developer and CS student. Turning ideas into smooth, functional digital experiences.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0f0f0f",
  width: "device-width",
  initialScale: 1,
};

// Force no caching — prevents browser from showing old content
export const headers = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
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
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased font-body bg-bg text-text-primary min-h-screen`}
      >
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(0 0% 10%)",
              border: "1px solid hsl(0 0% 18%)",
              color: "hsl(0 0% 95%)",
            },
          }}
        />
      </body>
    </html>
  );
}

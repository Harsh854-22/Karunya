import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#40916C",
};

export const metadata: Metadata = {
  title: "Karunya — AI Vegan Diet Guide",
  description:
    "Upload food images and instantly know if they're vegan. Get nutritionally-equivalent vegan alternatives with recipes and buy links.",
  keywords: ["vegan", "diet", "AI", "food analysis", "plant-based", "nutrition"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://karunya.app"),
  openGraph: {
    title: "Karunya — AI Vegan Diet Guide",
    description:
      "Upload food images and instantly know if they're vegan. Get plant-based alternatives with recipes.",
    type: "website",
    locale: "en_US",
    siteName: "Karunya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karunya — AI Vegan Diet Guide",
    description:
      "Upload food images and instantly know if they're vegan. Get plant-based alternatives.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white min-h-screen font-sans antialiased text-karunya-900 selection:bg-karunya-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

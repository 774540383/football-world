import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "عالم كرة القدم | Football World - المباريات المباشرة والأخبار",
    template: "%s | Football World",
  },
  description:
    "منصة كرة القدم العالمية الأولى - مباريات مباشرة، أخبار، إحصائيات، ترتيب الدوريات، كأس العالم وكل ما يخص كرة القدم",
  keywords: [
    "كرة قدم",
    "مباريات مباشرة",
    "كأس العالم",
    "الدوري الإنجليزي",
    "الدوري الإسباني",
    "دوري أبطال أوروبا",
    "football",
    "live scores",
    "world cup",
  ],
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "Football World",
    title: "عالم كرة القدم | Football World",
    description: "منصة كرة القدم العالمية الأولى",
  },
  twitter: {
    card: "summary_large_image",
    title: "Football World",
    description: "منصة كرة القدم العالمية الأولى",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="container pt-20 pb-8 min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const SITE_DESCRIPTION =
  "Career planning, mentoring and interview preparation for ambitious students and graduates targeting Finance, Accounting, Consulting, Engineering, Law and Marketing in the UK.";

export const metadata: Metadata = {
  metadataBase: new URL("https://polarisconsulting.uk"),
  title: {
    default: "POLARIS Consulting — Navigate Your Success",
    template: "%s · POLARIS Consulting",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  // Child pages set their own title/description; OG/Twitter inherit those plus
  // the shared og-image and site-name set here. We deliberately don't pin a
  // title/description in openGraph so per-page metadata flows through.
  openGraph: {
    siteName: "POLARIS Consulting",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "POLARIS Consulting — Navigate Your Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POLARIS Consulting — Navigate Your Success",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}

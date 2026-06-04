import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://polarisconsulting.uk"),
  title: {
    default: "POLARIS Consulting — Navigate Your Success",
    template: "%s · POLARIS Consulting",
  },
  description:
    "Career planning, mentoring and interview preparation for ambitious graduates targeting Finance, Consulting, Tech, Law and more in the UK.",
  openGraph: {
    title: "POLARIS Consulting — Navigate Your Success",
    description:
      "Career planning, mentoring and interview preparation for ambitious graduates.",
    url: "https://polarisconsulting.uk",
    siteName: "POLARIS Consulting",
    locale: "en_GB",
    type: "website",
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

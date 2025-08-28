import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NETI Portal - Company Profile",
  description:
    "Leading technology company dedicated to transforming businesses through innovative solutions and exceptional service delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransition>
          {children}
          <Footer />
          <CookieConsent />
        </PageTransition>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import SocialMediaModal from "@/components/FloatingSocialMediaCard";
import { ServiceModalProvider } from "@/contexts/ServiceModalContext";
import ServiceModal from "@/components/ServiceModal";

export const metadata: Metadata = {
  title: "NETI Portal - Company Profile",
  description:
    "Leading technology company dedicated to transforming businesses through innovative solutions and exceptional service delivery.",
  icons: {
    icon: "/assets/images/flag1.svg",
    shortcut: "/assets/images/flag1.svg",
    apple: "/assets/images/flag1.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <ServiceModalProvider>
          <PageTransition>
            {children}
            <Footer />
            <CookieConsent />
            <SocialMediaModal />
          </PageTransition>
          <ServiceModal />
        </ServiceModalProvider>
      </body>
    </html>
  );
}

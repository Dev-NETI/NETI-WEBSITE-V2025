import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "../components/PageTransition";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">
        <PageTransition>
          {children}
          <Footer />
          <CookieConsent />
        </PageTransition>
      </body>
    </html>
  );
}

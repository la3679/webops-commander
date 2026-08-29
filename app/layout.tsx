import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webops-commander.vercel.app"),
  title: { default: "WebOps Commander — Agent-Native Incident Response", template: "%s — WebOps Commander" },
  description: "A WebMCP-enabled incident command center where agents investigate safely and humans authorize consequential actions.",
  openGraph: {
    title: "WebOps Commander — Agent-Native Incident Response",
    description: "Production infrastructure designed for humans and agents.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

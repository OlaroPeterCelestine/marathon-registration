import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Marathon registration",
  description: "Capture runner email, name, country, contact, and socials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <div className="shell">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}

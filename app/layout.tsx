import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = Share_Tech_Mono({
  weight: "400",
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Red Hack CTF",
  description: "Plataforma do CTF com painel do competidor, ranking e administração segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

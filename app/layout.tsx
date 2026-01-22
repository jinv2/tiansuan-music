import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 👈 这一行是样式生效的核心！

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TianSuan DeepSeek Agent",
  description: "v3.1 Industrial Audio Transcription",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

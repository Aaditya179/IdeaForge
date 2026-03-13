import type { Metadata } from "next";
// Rebranded to IdeaForge
import "./globals.css";

export const metadata: Metadata = {
  title: "IdeaForge – Idea Innovation Lab",
  description: "Collaborative brainstorming canvas for modern teams. Capture, connect, and evolve ideas together.",
  keywords: ["brainstorming", "innovation", "collaboration", "idea management"],
  openGraph: {
    title: "IdeaForge – Idea Innovation Lab",
    description: "Collaborative brainstorming canvas for modern teams",
    type: "website",
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


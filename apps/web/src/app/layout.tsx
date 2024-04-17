import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@unibus/ui";
import { ThemeProvider, ThemeToggle } from "@unibus/ui/theme";
import { Toaster } from "@unibus/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "ttps://tbus.vercel.app"
      : "http://localhost:3000",
  ),
  title: "T Bus",
  description: "Tamarindo Bus",
  openGraph: {
    title: "T Bus",
    description: "Tamarindo Bus",
    url: "https://tbus.vercel.app",
    siteName: "T Bus",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

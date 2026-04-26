import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TenantKit Lite — Multi-Tenant SaaS Starter",
  description:
    "A production-style multi-tenant SaaS starter built with Next.js, TypeScript, SQLite, Prisma, and role-based access control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-on-background min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

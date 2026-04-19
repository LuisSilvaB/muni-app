import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Muni App | Gestión",
  description: "Sistema de gestión",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn( inter.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
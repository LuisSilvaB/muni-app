import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Muni App | Gestión Municipal",
  description: "Sistema de gestión municipal integral",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("font-sans", poppins.variable)}>
      <body className="font-sans antialiased">
        <TooltipProvider>
          <Providers>
            {children}
          </Providers>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  )
}
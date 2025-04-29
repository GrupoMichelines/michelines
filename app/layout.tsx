import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import WhatsAppNotification from "./components/whatsapp-notification"
import WhatsAppFloat from "./components/whatsapp-float"
import AdminAccessButton from "./components/admin-access-button"
import { Inter } from "next/font/google"
import { FeedbackBanner } from "./components/feedback-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grupo Michelines - 45 Anos de Tradição em Táxis",
  description: "Empresa especializada em locação de táxis para motoristas que desejam ingressar nesta nobre profissão.",
  icons: {
    icon: "/images/logos/logo-grupo-michelines.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <FeedbackBanner />
            <main className="mt-4">{children}</main>
          </div>
        </div>
        <WhatsAppNotification />
        <WhatsAppFloat />
        <AdminAccessButton />
      </body>
    </html>
  )
}


import './globals.css'
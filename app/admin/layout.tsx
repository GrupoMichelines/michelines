"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Star,
  Car, 
  Settings,
  Menu,
  X,
  Users,
  Calendar
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      title: "Avaliações",
      href: "/admin/avaliacoes",
      icon: Star
    },
    {
      title: "Solicitações",
      href: "/admin/solicitacoes",
      icon: Car
    },
    {
      title: "Clientes",
      href: "/admin/clientes",
      icon: Users
    },
    {
      title: "Agenda",
      href: "/admin/agenda",
      icon: Calendar
    },
    {
      title: "Configurações",
      href: "/admin/configuracoes",
      icon: Settings
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Painel Admin</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
          </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        </div>

      {/* Main Content */}
      <div className={`lg:ml-64 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

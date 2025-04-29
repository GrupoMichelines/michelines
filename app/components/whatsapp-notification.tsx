"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, MessageCircle } from "lucide-react"

export default function WhatsAppNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [hasNotification, setHasNotification] = useState(true)
  const [shouldHide, setShouldHide] = useState(false)

  useEffect(() => {
    // Verificar se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar inicialmente e adicionar listener para redimensionamento
    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Mostrar notificação após 5 segundos
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    // Ocultar notificação após 15 segundos
    const hideTimer = setTimeout(() => {
      setShouldHide(true)
    }, 15000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setHasNotification(false)
    }
  }

  if (!isVisible || shouldHide) return null

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-in-out ${
        isMobile ? "top-4 right-4" : "bottom-4 right-4"
      }`}
    >
      {isExpanded ? (
        <div className="bg-white rounded-lg overflow-hidden max-w-sm w-full shadow-lg animate-fade-in">
          <div className="bg-green-500 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-green-500">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">WhatsApp</p>
                <p className="text-white text-xs opacity-75">agora</p>
              </div>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-white hover:text-gray-200 focus:outline-none">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-3">
              Olá tudo bem! Acho que tem um veículo disponível para você. Vamos conversar?
            </p>
            <Link
              href="https://wa.me/5511944830851?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20os%20veículos%20disponíveis"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-full inline-block text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Responder agora
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleExpanded}
          className="relative bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300"
        >
          <MessageCircle className="h-7 w-7" />
          {hasNotification && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              1
            </span>
          )}
        </button>
      )}
    </div>
  )
}

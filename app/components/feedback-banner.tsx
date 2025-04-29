"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X } from "lucide-react"
import Link from "next/link"

export function FeedbackBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem("hasSeenFeedbackBanner")
    if (!hasSeenBanner) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenFeedbackBanner", "true")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-lg"
        >
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 p-2">
              <Star className="h-6 w-6 text-yellow-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Sua opinião é importante!</h3>
              <p className="text-sm text-white/90">
                Ajude-nos a melhorar nossos serviços avaliando sua experiência.
              </p>
            </div>
            <Link
              href="/evaluation"
              className="rounded-full bg-white px-6 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-white/90"
            >
              Avaliar Agora
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
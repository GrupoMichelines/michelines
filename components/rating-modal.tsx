"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/app/firebase/config"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [lgpdConsent, setLgpdConsent] = useState(false)

  const handleRating = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const ratingData = {
        rating,
        comment,
        name,
        phone,
        status: "Aprovado",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, "avaliacoes"), ratingData)
      onClose()

      // Reset form
      setRating(0)
      setComment("")
      setName("")
      setPhone("")
      setLgpdConsent(false)
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">
            Avalie nossa empresa
          </DialogTitle>
          <DialogDescription className="text-center text-justify text-sm sm:text-base">
            Sua opinião é muito importante para nós. Por favor, avalie sua experiência.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium block text-justify">
              Nome *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium block text-justify">
              Telefone *
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`p-1 rounded-full ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label htmlFor="comment" className="text-sm font-medium block text-justify">
              Comentário (opcional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[80px] p-2 border rounded-md text-sm"
              placeholder="Deixe seu comentário aqui..."
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="lgpd-consent"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-1"
                required
              />
              <label htmlFor="lgpd-consent" className="text-sm text-gray-600 text-justify">
                Concordo que minha avaliação e dados pessoais possam ser publicados no site da empresa, conforme a Lei Geral de Proteção de Dados (LGPD). *
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || !name || !phone || !lgpdConsent}
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

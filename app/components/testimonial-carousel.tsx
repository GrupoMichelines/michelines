"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Avaliacao {
  id: string
  name: string
  rating: number
  comment: string
  status: string
  createdAt: any
}

// Avaliações padrão para fallback
const defaultAvaliacoes: Avaliacao[] = [
  {
    id: "1",
    name: "João Silva",
    rating: 5,
    comment: "Excelente serviço! O Grupo Micheline's me ajudou a realizar meu sonho de ser taxista. Profissionais muito atenciosos e veículos em ótimo estado.",
    createdAt: new Date(),
    status: "Publicado"
  },
  {
    id: "2",
    name: "Maria Santos",
    rating: 5,
    comment: "Estou muito satisfeita com o atendimento e suporte oferecido. A frota é moderna e bem mantida, o que faz toda diferença no dia a dia.",
    createdAt: new Date(),
    status: "Publicado"
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    rating: 5,
    comment: "Melhor frota de táxis que já trabalhei. O suporte é incrível e os benefícios fazem valer a pena. Recomendo a todos!",
    createdAt: new Date(),
    status: "Publicado"
  }
]

export default function TestimonialCarousel() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const q = query(
      collection(db, "avaliacoes"),
      orderBy("createdAt", "desc"),
      limit(20)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const avaliacoesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Avaliacao[]

      // Filtrar apenas avaliações publicadas
      const avaliacoesPublicadas = avaliacoesData.filter(av => av.status === "Publicado")

      if (avaliacoesPublicadas.length > 0) {
        setAvaliacoes(avaliacoesPublicadas)
      } else {
        setAvaliacoes(defaultAvaliacoes)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === avaliacoes.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? avaliacoes.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {avaliacoes.map((avaliacao) => (
            <div 
              key={avaliacao.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < avaliacao.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
              ))}
            </div>

                <p className="text-gray-700 text-lg mb-6">
                  "{avaliacao.comment}"
                </p>

                <div className="text-blue-600 font-semibold">
                  {avaliacao.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="flex justify-center mt-4 gap-2">
        {avaliacoes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

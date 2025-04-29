"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { db, collections } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"

interface Evaluation {
  id: string
  driverId: string
  driverName: string
  evaluatorName: string
  date: string
  score: number
  comments: string
  status: "pending" | "approved" | "rejected"
}

export default function EvaluationDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, collections.evaluations, params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setEvaluation({
            id: docSnap.id,
            ...data,
            date: data.date?.toDate().toLocaleDateString("pt-BR") || "Data desconhecida",
          } as Evaluation)
        } else {
          console.error("Avaliação não encontrada")
          router.push("/admin/avaliacoes")
        }
      } catch (error) {
        console.error("Erro ao buscar avaliação:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [params.id, router])

  const handleUpdateStatus = async (newStatus: "approved" | "rejected") => {
    if (!evaluation) return

    try {
      await updateDoc(doc(db, collections.evaluations, evaluation.id), {
        status: newStatus,
      })

      setEvaluation({ ...evaluation, status: newStatus })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Ocorreu um erro ao atualizar o status da avaliação.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando avaliação...</p>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Avaliação não encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Detalhes da Avaliação</h1>
          <p className="text-gray-500">Visualize e gerencie os detalhes da avaliação</p>
        </div>
        <Link href="/admin/avaliacoes">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Avaliação</CardTitle>
            <CardDescription>Detalhes da avaliação do motorista</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Motorista</p>
              <p>{evaluation.driverName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Avaliador</p>
              <p>{evaluation.evaluatorName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Data</p>
              <p>{evaluation.date}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Nota</p>
              <p>{evaluation.score}/10</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  evaluation.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : evaluation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {evaluation.status === "approved"
                  ? "Aprovada"
                  : evaluation.status === "pending"
                    ? "Pendente"
                    : "Rejeitada"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comentários</CardTitle>
            <CardDescription>Avaliação detalhada do motorista</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Observações</p>
              <p className="whitespace-pre-wrap">{evaluation.comments}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {evaluation.status === "pending" && (
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={() => handleUpdateStatus("approved")}
          >
            <Check className="mr-2 h-4 w-4" />
            Aprovar Avaliação
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => handleUpdateStatus("rejected")}
          >
            <X className="mr-2 h-4 w-4" />
            Rejeitar Avaliação
          </Button>
        </div>
      )}
    </div>
  )
} 
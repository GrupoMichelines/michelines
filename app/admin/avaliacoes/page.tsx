"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Star, CheckCircle, XCircle, Clock, Eye, EyeOff, Archive, Search, Filter, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Avaliacao {
  id: string
  name: string
  phone: string
  rating: number
  comment: string
  status: string
  createdAt: any
}

export default function AvaliacoesAdmin() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("ativas")

  useEffect(() => {
    const q = query(collection(db, "avaliacoes"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const avaliacoesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      })) as Avaliacao[]
      
      setAvaliacoes(avaliacoesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "avaliacoes", id), {
        status: newStatus,
        updatedAt: new Date()
      })
      } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  // Filtros e estatísticas
  const avaliacoesAtivas = avaliacoes.filter(a => a.status !== "Arquivado")
  const avaliacoesArquivadas = avaliacoes.filter(a => a.status === "Arquivado")

  const filteredAvaliacoesAtivas = avaliacoesAtivas.filter(avaliacao => {
    const matchesSearch = avaliacao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avaliacao.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === "todos" || avaliacao.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const filteredAvaliacoesArquivadas = avaliacoesArquivadas.filter(avaliacao => {
    const matchesSearch = avaliacao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avaliacao.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === "todos" || avaliacao.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const estatisticas = {
    total: avaliacoesAtivas.length,
    publicadas: avaliacoesAtivas.filter(a => a.status === "Publicado").length,
    aprovadas: avaliacoesAtivas.filter(a => a.status === "Aprovado").length,
    pendentes: avaliacoesAtivas.filter(a => a.status === "Pendente").length,
    arquivadas: avaliacoesArquivadas.length,
    mediaRating: avaliacoesAtivas.reduce((acc, curr) => acc + curr.rating, 0) / avaliacoesAtivas.length || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const renderAvaliacoes = (avaliacoes: Avaliacao[]) => (
    <div className="grid gap-6">
      {avaliacoes.map((avaliacao) => (
        <div key={avaliacao.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{avaliacao.name}</h3>
              <p className="text-gray-600">{avaliacao.phone}</p>
                </div>
            <div className="flex items-center gap-2">
              {avaliacao.status === "Publicado" && (
                <span className="flex items-center text-green-600">
                  <Eye className="w-5 h-5 mr-1" />
                  Publicado
                </span>
              )}
              {avaliacao.status === "Aprovado" && (
                <span className="flex items-center text-blue-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  Aprovado
                </span>
              )}
              {avaliacao.status === "Pendente" && (
                <span className="flex items-center text-yellow-600">
                  <Clock className="w-5 h-5 mr-1" />
                  Pendente
                </span>
              )}
              {avaliacao.status === "Arquivado" && (
                <span className="flex items-center text-gray-600">
                  <Archive className="w-5 h-5 mr-1" />
                  Arquivado
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < avaliacao.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {avaliacao.comment && (
            <p className="text-gray-700 mb-4">{avaliacao.comment}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {avaliacao.status !== "Publicado" && avaliacao.status !== "Arquivado" && (
              <Button
                variant={avaliacao.status === "Publicado" ? "default" : "outline"}
                onClick={() => handleStatusChange(avaliacao.id, "Publicado")}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Publicar
              </Button>
            )}
            
            {avaliacao.status !== "Aprovado" && avaliacao.status !== "Arquivado" && (
              <Button
                variant={avaliacao.status === "Aprovado" ? "default" : "outline"}
                onClick={() => handleStatusChange(avaliacao.id, "Aprovado")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Aprovar
              </Button>
            )}

            {avaliacao.status === "Publicado" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(avaliacao.id, "Aprovado")}
                className="flex items-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Remover da Home
              </Button>
            )}

            {avaliacao.status !== "Arquivado" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(avaliacao.id, "Arquivado")}
                className="flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                Arquivar
              </Button>
            )}

            {avaliacao.status === "Arquivado" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(avaliacao.id, "Aprovado")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Restaurar
              </Button>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {avaliacao.createdAt?.toDate().toLocaleDateString("pt-BR")}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar avaliações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Avaliação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Avaliações</SelectItem>
              <SelectItem value="5">5 Estrelas</SelectItem>
              <SelectItem value="4">4 Estrelas</SelectItem>
              <SelectItem value="3">3 Estrelas</SelectItem>
              <SelectItem value="2">2 Estrelas</SelectItem>
              <SelectItem value="1">1 Estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{estatisticas.publicadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{estatisticas.aprovadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{estatisticas.pendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivadas</CardTitle>
            <Archive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{estatisticas.arquivadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {estatisticas.mediaRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="ativas" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativas">Avaliações Ativas</TabsTrigger>
          <TabsTrigger value="arquivadas">Avaliações Arquivadas</TabsTrigger>
        </TabsList>
        <TabsContent value="ativas">
          {renderAvaliacoes(filteredAvaliacoesAtivas)}
        </TabsContent>
        <TabsContent value="arquivadas">
          {renderAvaliacoes(filteredAvaliacoesArquivadas)}
        </TabsContent>
      </Tabs>
    </div>
  )
} 
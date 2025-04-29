"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Calendar,
  User,
  Star
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Solicitacao {
  id: string
  fullName: string
  status: string
  rating: number
  createdAt: any
  updatedAt: any
  documentos: {
    cnh: string
    extratoCnh: string
    analiseFinanceira: string
  }
}

export default function ReprovadosPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderByField, setOrderByField] = useState("fullName")
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc")
  const [filterStatus, setFilterStatus] = useState("Reprovado")

  useEffect(() => {
    fetchSolicitacoes()
  }, [orderByField, orderDirection, filterStatus])

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, "solicitacoes"),
        where("status", "==", filterStatus),
        orderBy(orderByField, orderDirection)
      )
      
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Solicitacao[]
      
      setSolicitacoes(data)
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReanalise = async (id: string) => {
    try {
      await updateDoc(doc(db, "solicitacoes", id), {
        status: "Em Reanálise",
        updatedAt: new Date()
      })
      fetchSolicitacoes()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleOrderBy = (field: string) => {
    if (orderByField === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc")
    } else {
      setOrderByField(field)
      setOrderDirection("asc")
    }
  }

  const filteredSolicitacoes = solicitacoes.filter(solicitacao =>
    solicitacao.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getOrderIcon = (field: string) => {
    if (orderByField !== field) return null
    return orderDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="px-4 lg:px-6 h-14 sm:h-16 flex items-center border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Cadastros Reprovados</h1>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle>Lista de Cadastros</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                    <SelectItem value="Em Reanálise">Em Reanálise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th 
                        className="text-left p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOrderBy("fullName")}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nome
                          {getOrderIcon("fullName")}
                        </div>
                      </th>
                      <th 
                        className="text-left p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOrderBy("createdAt")}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Data de Cadastro
                          {getOrderIcon("createdAt")}
                        </div>
                      </th>
                      <th 
                        className="text-left p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOrderBy("rating")}
                      >
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Avaliação
                          {getOrderIcon("rating")}
                        </div>
                      </th>
                      <th className="text-left p-4">Documentos</th>
                      <th className="text-left p-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSolicitacoes.map((solicitacao) => (
                      <tr key={solicitacao.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{solicitacao.fullName}</td>
                        <td className="p-4">
                          {format(solicitacao.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= solicitacao.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">
                              CNH: {solicitacao.documentos.cnh}
                            </span>
                            <span className="text-sm">
                              Extrato CNH: {solicitacao.documentos.extratoCnh}
                            </span>
                            <span className="text-sm">
                              Análise Financeira: {solicitacao.documentos.analiseFinanceira}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReanalise(solicitacao.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Reanalisar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 
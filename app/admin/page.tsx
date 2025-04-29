"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc, onSnapshot, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Driver as DriverType, Evaluation, RentalRequest } from "@/app/types"
import { 
  Star, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertCircle, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  Filter
} from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Avaliacao {
  rating: number
  status: string
  createdAt: any
  comment: string
  driverId: string
}

interface Solicitacao {
  status: string
  createdAt: any
  totalAmount: number
  driverId: string
  vehicleType: string
  driverName: string
}

interface Estatisticas {
  totalAvaliacoes: number
  mediaAvaliacoes: number
  totalSolicitacoes: number
  solicitacoesPendentes: number
  motoristasAtivos: number
  motoristasPendentes: number
  motoristasInativos: number
  avaliacoesPositivas: number
  avaliacoesNegativas: number
}

interface Driver {
  id: string
  name: string
  status: "active" | "pending" | "inactive" | "approved"
  createdAt: any
  // ... other driver properties
}

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalAvaliacoes: 0,
    mediaAvaliacoes: 0,
    totalSolicitacoes: 0,
    solicitacoesPendentes: 0,
    motoristasAtivos: 0,
    motoristasPendentes: 0,
    motoristasInativos: 0,
    avaliacoesPositivas: 0,
    avaliacoesNegativas: 0
  })
  const [periodo, setPeriodo] = useState("hoje")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchData()
    const qAvaliacoes = query(collection(db, "avaliacoes"), orderBy("createdAt", "desc"))
    const qSolicitacoes = query(collection(db, "solicitacoes"), orderBy("createdAt", "desc"))

    const unsubscribeAvaliacoes = onSnapshot(qAvaliacoes, (snapshot) => {
      const avaliacoesData = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Avaliacao[]
      setAvaliacoes(avaliacoesData)
      atualizarEstatisticas(avaliacoesData, solicitacoes)
    })

    const unsubscribeSolicitacoes = onSnapshot(qSolicitacoes, (snapshot) => {
      const solicitacoesData = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Solicitacao[]
      setSolicitacoes(solicitacoesData)
      atualizarEstatisticas(avaliacoes, solicitacoesData)
      setLoading(false)
    })

    return () => {
      unsubscribeAvaliacoes()
      unsubscribeSolicitacoes()
    }
  }, [])

  const atualizarEstatisticas = (avaliacoes: Avaliacao[], solicitacoes: Solicitacao[]) => {
    const estatisticasAtualizadas: Estatisticas = {
      totalAvaliacoes: avaliacoes.length,
      mediaAvaliacoes: avaliacoes.length > 0 
        ? avaliacoes.reduce((acc, curr) => acc + curr.rating, 0) / avaliacoes.length 
        : 0,
      totalSolicitacoes: solicitacoes.length,
      solicitacoesPendentes: solicitacoes.filter(s => s.status === "pending").length,
      motoristasAtivos: drivers.filter(d => d.status === "approved").length,
      motoristasPendentes: drivers.filter(d => d.status === "pending").length,
      motoristasInativos: drivers.filter(d => d.status === "inactive").length,
      avaliacoesPositivas: avaliacoes.filter(a => a.rating >= 4).length,
      avaliacoesNegativas: avaliacoes.filter(a => a.rating <= 2).length
    }

    setEstatisticas(estatisticasAtualizadas)
  }

  const fetchData = async () => {
    try {
      const [driversSnapshot, evaluationsSnapshot, rentalRequestsSnapshot] = await Promise.all([
        getDocs(query(collection(db, "drivers"), orderBy("createdAt", "desc"), limit(5))),
        getDocs(query(collection(db, "evaluations"), orderBy("createdAt", "desc"), limit(5))),
        getDocs(query(collection(db, "rentalRequests"), orderBy("createdAt", "desc"), limit(5)))
      ])

      const driversData = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Driver[]

      const evaluationsData = evaluationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Evaluation[]

      const rentalRequestsData = rentalRequestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RentalRequest[]

      setDrivers(driversData)
      setEvaluations(evaluationsData)
      setRentalRequests(rentalRequestsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-500 mt-1">Bem-vindo ao painel de controle da Michelines</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="semana">Esta Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Motoristas Aprovados</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {estatisticas.motoristasAtivos}
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>
                {drivers.length > 0 
                  ? `${Math.round((estatisticas.motoristasAtivos / drivers.length) * 100)}% dos motoristas`
                  : "Sem dados"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Solicitações Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {estatisticas.solicitacoesPendentes}
            </div>
            <div className="flex items-center text-xs text-yellow-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>
                {solicitacoes.length > 0
                  ? `${Math.round((estatisticas.solicitacoesPendentes / solicitacoes.length) * 100)}% das solicitações`
                  : "Sem dados"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {estatisticas.mediaAvaliacoes.toFixed(1)}
            </div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>
                {estatisticas.totalAvaliacoes > 0
                  ? `${estatisticas.totalAvaliacoes} avaliações no total`
                  : "Sem avaliações"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Atividade Recente</span>
                <Link href="/admin/solicitacoes">
                  <Button variant="ghost" size="sm">
                    Ver Tudo <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rentalRequests.slice(0, 5).map((request) => (
                  <Link key={request.id} href={`/admin/solicitacoes/${request.id}`}>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Car className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.driverName}</p>
                          <p className="text-sm text-gray-500">
                            {request.vehicleType} - {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={request.status === "approved" ? "default" : "secondary"}>
                        {request.status === "approved" ? "Aprovado" : "Pendente"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Driver Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Motoristas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Ativos</span>
                  </div>
                  <span className="font-medium">{drivers.filter(d => d.status === "active").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Pendentes</span>
                  </div>
                  <span className="font-medium">{drivers.filter(d => d.status === "pending").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Inativos</span>
                  </div>
                  <span className="font-medium">{drivers.filter(d => d.status === "inactive").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Avaliações Recentes</span>
                <Link href="/admin/avaliacoes">
                  <Button variant="ghost" size="sm">
                    Ver Tudo <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {evaluations.slice(0, 5).map((evaluation) => (
                  <Link key={evaluation.id} href={`/admin/avaliacoes/${evaluation.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{evaluation.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(evaluation.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{evaluation.comment}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/motoristas/novo">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>Novo Motorista</span>
                  </Button>
                </Link>
                <Link href="/admin/solicitacoes">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full">
                    <Car className="h-4 w-4" />
                    <span>Solicitações</span>
                  </Button>
                </Link>
                <Link href="/admin/avaliacoes">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full">
                    <Star className="h-4 w-4" />
                    <span>Avaliações</span>
                  </Button>
                </Link>
                <Link href="/admin/usuarios">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

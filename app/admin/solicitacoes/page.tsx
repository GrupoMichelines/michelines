"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Archive,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Clock4,
  MapPin,
  Car,
  Users,
  Edit,
  Save,
  Loader2,
  PhoneCall,
  Mail as MailIcon,
  Calendar
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

interface Analise {
  id: string
  motoristaId: string
  analista: string
  data: any // Permitindo qualquer tipo de data
  comentario: string
  status: "Aprovado" | "Aguardar" | "Reprovado"
  documentosVerificados: boolean
  antecedentesVerificados: boolean
  experienciaVerificada: boolean
  referenciasVerificadas: boolean
}

interface Experiencia {
  anos: number
  locacoes: {
    frota: string
    tempoLocacao: string
    observacoes: string
  }[]
}

interface Referencia {
  nome: string
  telefone: string
  grauProximidade: string
}

interface Documentos {
  cnh: boolean
  condutax: boolean
  certidaoProntuario: boolean
  comprovanteEndereco: boolean
  outros: {
    tipo: string
    status: boolean
  }[]
}

interface Solicitacao {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  cpf: string
  condutax: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  rating: number
  status: "Aprovado" | "Aguardar" | "Reprovado"
  createdAt: any
  updatedAt: any
  analises: Analise[]
  documentos: Documentos
  experiencia: Experiencia
  referencias: Referencia[]
  observacoes: string
}

export default function SolicitacoesAdmin() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("aguardando")
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null)
  const [novaAnalise, setNovaAnalise] = useState<{
    comentario: string;
    status: "Aprovado" | "Aguardar" | "Reprovado";
    documentosVerificados: boolean;
    antecedentesVerificados: boolean;
    experienciaVerificada: boolean;
    referenciasVerificadas: boolean;
  }>({
    comentario: "",
    status: "Aguardar",
    documentosVerificados: false,
    antecedentesVerificados: false,
    experienciaVerificada: false,
    referenciasVerificadas: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedData, setEditedData] = useState<any>(null)

  useEffect(() => {
    const q = query(collection(db, "solicitacoes"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const solicitacoesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        analises: doc.data().analises || [],
        documentos: doc.data().documentos || {
          cnh: false,
          condutax: false,
          certidaoProntuario: false,
          comprovanteEndereco: false,
          outros: []
        },
        experiencia: doc.data().experiencia || {
          anos: 0,
          locacoes: []
        },
        referencias: doc.data().referencias || [],
        observacoes: doc.data().observacoes || ''
      })) as Solicitacao[]

      setSolicitacoes(solicitacoesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (id: string, newStatus: "Aprovado" | "Aguardar" | "Reprovado") => {
    try {
      setIsSaving(true);
      const docRef = doc(db, "solicitacoes", id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      setSelectedSolicitacao(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleAddAnalise = async (solicitacaoId: string) => {
    try {
      const analiseData = {
        ...novaAnalise,
        motoristaId: solicitacaoId,
        analista: "Admin", // Substitua pelo nome do usuário logado
        data: new Date()
      }

      const docRef = await addDoc(collection(db, "analises"), analiseData)

      // Atualiza a solicitação com a nova análise
      const solicitacaoRef = doc(db, "solicitacoes", solicitacaoId)
      const solicitacao = solicitacoes.find(s => s.id === solicitacaoId)

      if (solicitacao) {
        await updateDoc(solicitacaoRef, {
          analises: [...solicitacao.analises, { id: docRef.id, ...analiseData }],
          status: novaAnalise.status,
          updatedAt: new Date()
        })
      }

      setNovaAnalise({
        comentario: "",
        status: "Aguardar",
        documentosVerificados: false,
        antecedentesVerificados: false,
        experienciaVerificada: false,
        referenciasVerificadas: false
      })
    } catch (error) {
      console.error("Erro ao adicionar análise:", error)
    }
  }

  const handleContact = (type: "email" | "whatsapp" | "phone", solicitacao: Solicitacao) => {
    switch (type) {
      case "email":
        window.open(`mailto:${solicitacao.email}`)
        break
      case "whatsapp":
        window.open(`https://wa.me/${solicitacao.phone.replace(/\D/g, '')}`)
        break
      case "phone":
        window.open(`tel:${solicitacao.phone}`)
        break
    }
  }

  // Filtros
  const solicitacoesAguardando = solicitacoes.filter(s => s.status === "Aguardar")
  const solicitacoesAprovadas = solicitacoes.filter(s => s.status === "Aprovado")
  const solicitacoesReprovadas = solicitacoes.filter(s => s.status === "Reprovado")

  const filteredSolicitacoes = (solicitacoes: Solicitacao[]) => {
    if (!searchTerm) return solicitacoes;

    const searchTermLower = searchTerm.toLowerCase().trim();
    
    return solicitacoes.filter(solicitacao => {
      // Remove caracteres não numéricos para busca de CPF e telefone
      const searchTermNumbers = searchTermLower.replace(/\D/g, '');
      
      // Busca por nome completo
      const fullNameMatch = solicitacao.fullName?.toLowerCase().includes(searchTermLower);
      
      // Busca por CPF (com ou sem formatação)
      const cpfMatch = solicitacao.cpf?.replace(/\D/g, '').includes(searchTermNumbers);
      
      // Busca por telefone (com ou sem formatação)
      const phoneMatch = solicitacao.phone?.replace(/\D/g, '').includes(searchTermNumbers);
      
      // Busca por email
      const emailMatch = solicitacao.email?.toLowerCase().includes(searchTermLower);
      
      // Busca por condutax
      const condutaxMatch = solicitacao.condutax?.toLowerCase().includes(searchTermLower);

      return fullNameMatch || cpfMatch || phoneMatch || emailMatch || condutaxMatch;
    });
  }

  const formatDate = (date: any) => {
    if (date instanceof Date) {
      return date
    }
    if (date && typeof date.toDate === 'function') {
      return date.toDate()
    }
    return new Date(date)
  }

  const renderSolicitacao = (solicitacao: Solicitacao) => (
    <div key={solicitacao.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{solicitacao.fullName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <a href={`tel:+55${solicitacao.phone}`} className="hover:text-blue-600">
                    {solicitacao.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <a href={`mailto:${solicitacao.email}`} className="hover:text-blue-600">
                    {solicitacao.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>{solicitacao.cpf}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              {solicitacao.status === "Aprovado" && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Aprovado
                </Badge>
              )}
              {solicitacao.status === "Aguardar" && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-4 h-4 mr-1" />
                  Aguardando
                </Badge>
              )}
              {solicitacao.status === "Reprovado" && (
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  <XCircle className="w-4 h-4 mr-1" />
                  Reprovado
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContact("email", solicitacao)}
                title="Enviar email"
                className="hover:bg-blue-50"
              >
                <Mail className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContact("whatsapp", solicitacao)}
                title="Enviar mensagem no WhatsApp"
                className="hover:bg-green-50"
              >
                <MessageSquare className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleContact("phone", solicitacao)}
                title="Ligar"
                className="hover:bg-blue-50"
              >
                <Phone className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSolicitacao(solicitacao)}
                className="flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <FileText className="w-4 h-4 mr-2" />
              <span>Documentos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={solicitacao.documentos.cnh ? "default" : "secondary"}>
                CNH: {solicitacao.documentos.cnh ? "✓" : "✗"}
              </Badge>
              <Badge variant={solicitacao.documentos.condutax ? "default" : "secondary"}>
                CONDUTAX: {solicitacao.documentos.condutax ? "✓" : "✗"}
              </Badge>
              <Badge variant={solicitacao.documentos.certidaoProntuario ? "default" : "secondary"}>
                Cert. CNH: {solicitacao.documentos.certidaoProntuario ? "✓" : "✗"}
              </Badge>
              <Badge variant={solicitacao.documentos.comprovanteEndereco ? "default" : "secondary"}>
                Endereço: {solicitacao.documentos.comprovanteEndereco ? "✓" : "✗"}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <Car className="w-4 h-4 mr-2" />
              <span>Experiência</span>
            </div>
            <div>
              <p>{solicitacao.experiencia.anos} anos</p>
              <p className="text-gray-500">{solicitacao.experiencia.locacoes?.length || 0} locações</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>Referências</span>
            </div>
            <div>
              <p>{solicitacao.referencias?.length || 0} referências</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Data de Cadastro</span>
            </div>
            <div>
              <p>{formatDate(solicitacao.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData(selectedSolicitacao)
  }

  const handleSave = async () => {
    if (!selectedSolicitacao || !editedData) return;

    setIsSaving(true)
    try {
      const docRef = doc(db, "solicitacoes", selectedSolicitacao.id);
      await updateDoc(docRef, {
        ...editedData,
        updatedAt: new Date()
      });
      setSelectedSolicitacao(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedData({
      ...editedData,
      [field]: value
    })
  }

  const handleDocumentChange = (field: string, value: any) => {
    if (field === 'outros') {
      setEditedData({
        ...editedData,
        documentos: {
          ...editedData.documentos,
          outros: value
        }
      });
    } else {
      setEditedData({
        ...editedData,
        documentos: {
          ...editedData.documentos,
          [field]: value
        }
      });
    }
  }

  const handleExperienceChange = (field: string, value: any) => {
    setEditedData({
      ...editedData,
      experiencia: {
        ...editedData.experiencia,
        [field]: value
      }
    })
  }

  const handleReferenceChange = (index: number, field: string, value: string) => {
    const newReferences = [...editedData.referencias]
    newReferences[index] = {
      ...newReferences[index],
      [field]: value
    }
    setEditedData({
      ...editedData,
      referencias: newReferences
    })
  }

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Solicitações de Motoristas</h1>
          <p className="text-gray-600 mt-1">Gerencie as solicitações de motoristas da locadora</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              placeholder="Pesquisar por nome, CPF, telefone, email ou condutax..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-96 border-blue-200 focus:border-blue-500"
            />
            {searchInput && (
              <XCircle 
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => {
                  setSearchInput('');
                  setSearchTerm('');
                }}
              />
            )}
            <Button
              onClick={handleSearch}
              className="ml-2 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Pesquisar
            </Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Aguardar">Aguardando</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {searchTerm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-blue-50 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Resultados da pesquisa para "{searchTerm}"
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredSolicitacoes(solicitacoes).length} resultado(s) encontrado(s)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput('');
                  setSearchTerm('');
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Limpar pesquisa
              </Button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-4"
          >
            {filteredSolicitacoes(solicitacoes).map(renderSolicitacao)}
          </motion.div>
        </motion.div>
      )}

      {!searchTerm && (
        <Tabs defaultValue="aguardando" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white p-2 rounded-lg shadow-sm">
            <TabsTrigger value="aguardando" className="flex items-center data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
              <Clock className="w-4 h-4 mr-2" />
              Aguardando
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                {solicitacoesAguardando.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="aprovados" className="flex items-center data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovados
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                {solicitacoesAprovadas.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reprovados" className="flex items-center data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
              <XCircle className="w-4 h-4 mr-2" />
              Reprovados
              <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                {solicitacoesReprovadas.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aguardando" className="mt-4">
            {filteredSolicitacoes(solicitacoesAguardando).length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <p>Nenhum motorista aguardando análise</p>
              </div>
            ) : (
              filteredSolicitacoes(solicitacoesAguardando).map(renderSolicitacao)
            )}
          </TabsContent>

          <TabsContent value="aprovados" className="mt-4">
            {filteredSolicitacoes(solicitacoesAprovadas).length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p>Nenhum motorista aprovado</p>
              </div>
            ) : (
              filteredSolicitacoes(solicitacoesAprovadas).map(renderSolicitacao)
            )}
          </TabsContent>

          <TabsContent value="reprovados" className="mt-4">
            {filteredSolicitacoes(solicitacoesReprovadas).length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <p>Nenhum motorista reprovado</p>
              </div>
            ) : (
              filteredSolicitacoes(solicitacoesReprovadas).map(renderSolicitacao)
            )}
          </TabsContent>
        </Tabs>
      )}

      {selectedSolicitacao && (
        <Dialog open={!!selectedSolicitacao} onOpenChange={() => setSelectedSolicitacao(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-blue-800">Detalhes da Solicitação</DialogTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={handleEdit} className="flex items-center border-blue-200 hover:bg-blue-50">
                    <Edit className="w-4 h-4 mr-2 text-blue-600" />
                    Editar
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleSave}
                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Informações Pessoais */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Informações Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Nome Completo</p>
                        <Input
                          value={editedData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPF</p>
                        <Input
                          value={editedData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <Input
                          value={editedData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <Input
                          value={editedData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Nome Completo</p>
                        <p className="font-medium">{selectedSolicitacao.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPF</p>
                        <p className="font-medium">{selectedSolicitacao.cpf}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center space-x-2">
                          <MailIcon className="w-4 h-4 text-gray-500" />
                          <a 
                            href={`mailto:${selectedSolicitacao.email}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedSolicitacao.email}
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <div className="flex items-center space-x-2">
                          <PhoneCall className="w-4 h-4 text-gray-500" />
                          <a 
                            href={`tel:${selectedSolicitacao.phone}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedSolicitacao.phone}
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">CEP</p>
                    <p className="font-medium">{selectedSolicitacao.cep}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rua</p>
                    <p className="font-medium">{selectedSolicitacao.street}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Número</p>
                    <p className="font-medium">{selectedSolicitacao.number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bairro</p>
                    <p className="font-medium">{selectedSolicitacao.neighborhood}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cidade</p>
                    <p className="font-medium">{selectedSolicitacao.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="font-medium">{selectedSolicitacao.state}</p>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Documentos Obrigatórios</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedData.documentos?.cnh || false}
                            onChange={(e) => handleDocumentChange('cnh', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span>CNH</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedData.documentos?.condutax || false}
                            onChange={(e) => handleDocumentChange('condutax', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span>CONDUTAX</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedData.documentos?.certidaoProntuario || false}
                            onChange={(e) => handleDocumentChange('certidaoProntuario', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span>Certidão de Prontuário de CNH</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editedData.documentos?.comprovanteEndereco || false}
                            onChange={(e) => handleDocumentChange('comprovanteEndereco', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span>Comprovante de Endereço</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">Outros Documentos</p>
                        {editedData.documentos?.outros?.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center space-x-4">
                            <Input
                              value={doc.tipo || ''}
                              onChange={(e) => {
                                const newOutros = [...editedData.documentos.outros]
                                newOutros[index] = {
                                  ...newOutros[index],
                                  tipo: e.target.value
                                }
                                handleDocumentChange('outros', newOutros)
                              }}
                              className="w-full"
                              placeholder="Tipo do documento"
                            />
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={doc.status || false}
                                onChange={(e) => {
                                  const newOutros = [...editedData.documentos.outros]
                                  newOutros[index] = {
                                    ...newOutros[index],
                                    status: e.target.checked
                                  }
                                  handleDocumentChange('outros', newOutros)
                                }}
                                className="h-4 w-4"
                              />
                              <span>Verificado</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newOutros = [...editedData.documentos.outros]
                                newOutros.splice(index, 1)
                                handleDocumentChange('outros', newOutros)
                              }}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newOutros = [...(editedData.documentos?.outros || [])]
                            newOutros.push({
                              tipo: '',
                              status: false
                            })
                            handleDocumentChange('outros', newOutros)
                          }}
                          className="w-full"
                        >
                          Adicionar Outro Documento
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">CNH</p>
                          <Badge variant={selectedSolicitacao.documentos?.cnh ? "default" : "secondary"}>
                            {selectedSolicitacao.documentos?.cnh ? "✓" : "✗"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CONDUTAX</p>
                          <Badge variant={selectedSolicitacao.documentos?.condutax ? "default" : "secondary"}>
                            {selectedSolicitacao.documentos?.condutax ? "✓" : "✗"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Certidão de Prontuário de CNH</p>
                          <Badge variant={selectedSolicitacao.documentos?.certidaoProntuario ? "default" : "secondary"}>
                            {selectedSolicitacao.documentos?.certidaoProntuario ? "✓" : "✗"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Comprovante de Endereço</p>
                          <Badge variant={selectedSolicitacao.documentos?.comprovanteEndereco ? "default" : "secondary"}>
                            {selectedSolicitacao.documentos?.comprovanteEndereco ? "✓" : "✗"}
                          </Badge>
                        </div>
                      </div>
                      {selectedSolicitacao.documentos?.outros?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Outros Documentos</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedSolicitacao.documentos.outros.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="font-medium">{doc.tipo}</span>
                                <Badge variant={doc.status ? "default" : "secondary"}>
                                  {doc.status ? "✓" : "✗"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Experiência */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Locações Anteriores</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <div className="space-y-4">
                          {editedData.experiencia?.locacoes?.map((locacao: any, index: number) => (
                            <div key={index} className="border p-4 rounded-lg space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Frota</p>
                                  <Input
                                    value={locacao.frota || ''}
                                    onChange={(e) => {
                                      const newLocacoes = [...editedData.experiencia.locacoes]
                                      newLocacoes[index] = {
                                        ...newLocacoes[index],
                                        frota: e.target.value
                                      }
                                      handleExperienceChange('locacoes', newLocacoes)
                                    }}
                                    className="w-full"
                                    placeholder="Nome da frota"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Tempo de Locação</p>
                                  <Input
                                    value={locacao.tempoLocacao || ''}
                                    onChange={(e) => {
                                      const newLocacoes = [...editedData.experiencia.locacoes]
                                      newLocacoes[index] = {
                                        ...newLocacoes[index],
                                        tempoLocacao: e.target.value
                                      }
                                      handleExperienceChange('locacoes', newLocacoes)
                                    }}
                                    className="w-full"
                                    placeholder="Ex: 2 anos"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Observações</p>
                                <Textarea
                                  value={locacao.observacoes || ''}
                                  onChange={(e) => {
                                    const newLocacoes = [...editedData.experiencia.locacoes]
                                    newLocacoes[index] = {
                                      ...newLocacoes[index],
                                      observacoes: e.target.value
                                    }
                                    handleExperienceChange('locacoes', newLocacoes)
                                  }}
                                  className="w-full"
                                  rows={2}
                                  placeholder="Observações sobre a locação"
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newLocacoes = [...(editedData.experiencia?.locacoes || [])]
                              newLocacoes.push({
                                frota: '',
                                tempoLocacao: '',
                                observacoes: ''
                              })
                              handleExperienceChange('locacoes', newLocacoes)
                            }}
                            className="w-full"
                          >
                            Adicionar Locação
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Anos de Experiência</p>
                        <p className="font-medium">{selectedSolicitacao.experiencia?.anos || 0} anos</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Locações Anteriores</p>
                        <div className="space-y-4">
                          {selectedSolicitacao.experiencia?.locacoes?.map((locacao, index) => (
                            <div key={index} className="border p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Frota</p>
                                  <p className="font-medium">{locacao.frota || 'Não informado'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Tempo de Locação</p>
                                  <p className="font-medium">{locacao.tempoLocacao || 'Não informado'}</p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Observações</p>
                                <p className="font-medium">{locacao.observacoes || 'Nenhuma observação'}</p>
                              </div>
                            </div>
                          )) || (
                              <p className="text-gray-500">Nenhuma locação anterior cadastrada</p>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Referências */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Referências</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      {editedData.referencias?.map((referencia: Referencia, index: number) => (
                        <div key={index} className="border p-4 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Nome</p>
                              <Input
                                value={referencia.nome || ''}
                                onChange={(e) => handleReferenceChange(index, 'nome', e.target.value)}
                                className="w-full"
                                placeholder="Nome completo"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Telefone</p>
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={referencia.telefone || ''}
                                  onChange={(e) => handleReferenceChange(index, 'telefone', e.target.value)}
                                  className="w-full"
                                  placeholder="(00) 00000-0000"
                                />
                                <span className="text-gray-500">+55</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Grau de Proximidade</p>
                              <Select
                                value={referencia.grauProximidade || ''}
                                onValueChange={(value) => handleReferenceChange(index, 'grauProximidade', value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Familiar">Familiar</SelectItem>
                                  <SelectItem value="Amigo">Amigo</SelectItem>
                                  <SelectItem value="Colega de Trabalho">Colega de Trabalho</SelectItem>
                                  <SelectItem value="Vizinho">Vizinho</SelectItem>
                                  <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newReferences = [...editedData.referencias]
                                newReferences.splice(index, 1)
                                handleExperienceChange('referencias', newReferences)
                              }}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newReferences = [...(editedData.referencias || [])]
                          newReferences.push({
                            nome: '',
                            telefone: '',
                            grauProximidade: ''
                          })
                          handleExperienceChange('referencias', newReferences)
                        }}
                        className="w-full"
                      >
                        Adicionar Referência
                      </Button>
                    </>
                  ) : (
                    <>
                      {selectedSolicitacao.referencias?.map((referencia, index) => (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Nome</p>
                              <p className="font-medium">{referencia.nome || 'Não informado'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Telefone</p>
                              <div className="flex items-center space-x-2">
                                <PhoneCall className="w-4 h-4 text-gray-500" />
                                <a 
                                  href={`tel:+55${referencia.telefone}`}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  +55 {referencia.telefone || 'Não informado'}
                                </a>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Grau de Proximidade</p>
                              <p className="font-medium">{referencia.grauProximidade || 'Não informado'}</p>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500">Nenhuma referência cadastrada</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Observações</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={editedData.observacoes || ''}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      className="w-full min-h-[100px]"
                      placeholder="Adicione observações importantes sobre o motorista..."
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {selectedSolicitacao.observacoes ? (
                        <p className="whitespace-pre-wrap">{selectedSolicitacao.observacoes}</p>
                      ) : (
                        <p className="text-gray-500 italic">Nenhuma observação registrada</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedSolicitacao.id, "Reprovado")}
                  className="flex items-center border-red-200 hover:bg-red-50 text-red-600"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reprovado
                    </>
                  )}
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleStatusChange(selectedSolicitacao.id, "Aprovado")}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovado
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 
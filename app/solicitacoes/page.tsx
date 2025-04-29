"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { 
  User, 
  FileCheck, 
  Briefcase, 
  Users,
  ClipboardCheck,
  Check,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Save,
  X,
  Search,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Solicitacao {
  id: string
  fullName: string
  email: string
  phone: string
  status: string
  rating: number
  analise?: {
    experiencia: {
      anos: number
      empresas: string[]
      observacoes: string
    }
    documentos: {
      cnh: string
      extratoCnh: string
      analiseFinanceira: string
      outros: string[]
    }
    referencias: {
      nome: string
      telefone: string
      tipo: string
      status: string
    }[]
    statusGeral: string
    observacoesGerais: string
  }
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSolicitacoes()
  }, [])

  const fetchSolicitacoes = async () => {
    try {
      const q = query(collection(db, "solicitacoes"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Solicitacao[]
      setSolicitacoes(data)
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAnalise = async () => {
    if (!selectedSolicitacao) return

    try {
      const docRef = doc(db, "solicitacoes", selectedSolicitacao.id)
      await updateDoc(docRef, {
        analise: selectedSolicitacao.analise,
        status: selectedSolicitacao.analise?.statusGeral || "Pendente"
      })
      fetchSolicitacoes()
    } catch (error) {
      console.error("Erro ao atualizar análise:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "text-green-600 bg-green-50"
      case "Reprovado":
        return "text-red-600 bg-red-50"
      case "Pendente":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <Check className="w-4 h-4" />
      case "Reprovado":
        return <AlertCircle className="w-4 h-4" />
      case "Pendente":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredSolicitacoes = solicitacoes.filter(solicitacao => {
    const matchesSearch = solicitacao.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || solicitacao.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-1 py-6 sm:py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Painel de Solicitações
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Solicitações */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Solicitações</CardTitle>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Reprovado">Reprovado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar motorista..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredSolicitacoes.map((solicitacao) => (
                      <div
                        key={solicitacao.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedSolicitacao?.id === solicitacao.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedSolicitacao(solicitacao)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{solicitacao.fullName}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(solicitacao.status)}`}>
                            {solicitacao.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{solicitacao.email}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Análise */}
            <div className="lg:col-span-3">
              {selectedSolicitacao ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Análise do Motorista</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedSolicitacao(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Fechar
                        </Button>
                        <Button onClick={handleUpdateAnalise}>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Análise
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Seção de Experiência */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
                          <Briefcase className="w-5 h-5" />
                          Experiência
                        </h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Anos de Experiência</Label>
                              <Input
                                type="number"
                                value={selectedSolicitacao.analise?.experiencia?.anos || 0}
                                onChange={(e) => setSelectedSolicitacao(prev => ({
                                  ...prev!,
                                  analise: {
                                    ...prev!.analise!,
                                    experiencia: {
                                      ...prev!.analise!.experiencia!,
                                      anos: parseInt(e.target.value)
                                    }
                                  }
                                }))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Empresas Anteriores</label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const novasEmpresas = [...(selectedSolicitacao.analise?.experiencia?.empresas || []), ""]
                                  setSelectedSolicitacao(prev => ({
                                    ...prev!,
                                    analise: {
                                      ...prev!.analise!,
                                      experiencia: {
                                        ...prev!.analise!.experiencia!,
                                        empresas: novasEmpresas
                                      }
                                    }
                                  }))
                                }}
                                className="flex items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar
                              </Button>
                            </div>
                            {(selectedSolicitacao.analise?.experiencia?.empresas || []).map((empresa, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={empresa}
                                  onChange={(e) => {
                                    const novasEmpresas = [...(selectedSolicitacao.analise?.experiencia?.empresas || [])]
                                    novasEmpresas[index] = e.target.value
                                    setSelectedSolicitacao(prev => ({
                                      ...prev!,
                                      analise: {
                                        ...prev!.analise!,
                                        experiencia: {
                                          ...prev!.analise!.experiencia!,
                                          empresas: novasEmpresas
                                        }
                                      }
                                    }))
                                  }}
                                  placeholder="Nome da empresa"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const novasEmpresas = (selectedSolicitacao.analise?.experiencia?.empresas || []).filter((_, i) => i !== index)
                                    setSelectedSolicitacao(prev => ({
                                      ...prev!,
                                      analise: {
                                        ...prev!.analise!,
                                        experiencia: {
                                          ...prev!.analise!.experiencia!,
                                          empresas: novasEmpresas
                                        }
                                      }
                                    }))
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label>Observações</Label>
                            <Textarea
                              value={selectedSolicitacao.analise?.experiencia?.observacoes || ""}
                              onChange={(e) => setSelectedSolicitacao(prev => ({
                                ...prev!,
                                analise: {
                                  ...prev!.analise!,
                                  experiencia: {
                                    ...prev!.analise!.experiencia!,
                                    observacoes: e.target.value
                                  }
                                }
                              }))}
                              placeholder="Observações sobre a experiência"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Seção de Documentos */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                          <FileCheck className="w-5 h-5" />
                          Documentos
                        </h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>CNH</Label>
                              <Select
                                value={selectedSolicitacao.analise?.documentos?.cnh || "Pendente"}
                                onValueChange={(value) => setSelectedSolicitacao(prev => ({
                                  ...prev!,
                                  analise: {
                                    ...prev!.analise!,
                                    documentos: {
                                      ...prev!.analise!.documentos!,
                                      cnh: value
                                    }
                                  }
                                }))}
                              >
                                <SelectTrigger className={getStatusColor(selectedSolicitacao.analise?.documentos?.cnh || "Pendente")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                                  <SelectItem value="Reprovado">Reprovado</SelectItem>
                                  <SelectItem value="Pendente">Pendente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Extrato da CNH</Label>
                              <Select
                                value={selectedSolicitacao.analise?.documentos?.extratoCnh || "Pendente"}
                                onValueChange={(value) => setSelectedSolicitacao(prev => ({
                                  ...prev!,
                                  analise: {
                                    ...prev!.analise!,
                                    documentos: {
                                      ...prev!.analise!.documentos!,
                                      extratoCnh: value
                                    }
                                  }
                                }))}
                              >
                                <SelectTrigger className={getStatusColor(selectedSolicitacao.analise?.documentos?.extratoCnh || "Pendente")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                                  <SelectItem value="Reprovado">Reprovado</SelectItem>
                                  <SelectItem value="Pendente">Pendente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Análise Financeira (SERASA)</Label>
                              <Select
                                value={selectedSolicitacao.analise?.documentos?.analiseFinanceira || "Pendente"}
                                onValueChange={(value) => setSelectedSolicitacao(prev => ({
                                  ...prev!,
                                  analise: {
                                    ...prev!.analise!,
                                    documentos: {
                                      ...prev!.analise!.documentos!,
                                      analiseFinanceira: value
                                    }
                                  }
                                }))}
                              >
                                <SelectTrigger className={getStatusColor(selectedSolicitacao.analise?.documentos?.analiseFinanceira || "Pendente")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                                  <SelectItem value="Reprovado">Reprovado</SelectItem>
                                  <SelectItem value="Pendente">Pendente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seção de Referências */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700">
                          <Users className="w-5 h-5" />
                          Referências
                        </h2>
                        <div className="space-y-4">
                          {(selectedSolicitacao.analise?.referencias || []).map((referencia, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">Referência {index + 1}</h3>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const novasReferencias = (selectedSolicitacao.analise?.referencias || []).filter((_, i) => i !== index)
                                    setSelectedSolicitacao(prev => ({
                                      ...prev!,
                                      analise: {
                                        ...prev!.analise!,
                                        referencias: novasReferencias
                                      }
                                    }))
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Nome</Label>
                                  <Input
                                    value={referencia.nome}
                                    onChange={(e) => {
                                      const novasReferencias = [...(selectedSolicitacao.analise?.referencias || [])]
                                      novasReferencias[index].nome = e.target.value
                                      setSelectedSolicitacao(prev => ({
                                        ...prev!,
                                        analise: {
                                          ...prev!.analise!,
                                          referencias: novasReferencias
                                        }
                                      }))
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Telefone</Label>
                                  <Input
                                    value={referencia.telefone}
                                    onChange={(e) => {
                                      const novasReferencias = [...(selectedSolicitacao.analise?.referencias || [])]
                                      novasReferencias[index].telefone = e.target.value
                                      setSelectedSolicitacao(prev => ({
                                        ...prev!,
                                        analise: {
                                          ...prev!.analise!,
                                          referencias: novasReferencias
                                        }
                                      }))
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Tipo</Label>
                                  <Input
                                    value={referencia.tipo}
                                    onChange={(e) => {
                                      const novasReferencias = [...(selectedSolicitacao.analise?.referencias || [])]
                                      novasReferencias[index].tipo = e.target.value
                                      setSelectedSolicitacao(prev => ({
                                        ...prev!,
                                        analise: {
                                          ...prev!.analise!,
                                          referencias: novasReferencias
                                        }
                                      }))
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select
                                    value={referencia.status}
                                    onValueChange={(value) => {
                                      const novasReferencias = [...(selectedSolicitacao.analise?.referencias || [])]
                                      novasReferencias[index].status = value
                                      setSelectedSolicitacao(prev => ({
                                        ...prev!,
                                        analise: {
                                          ...prev!.analise!,
                                          referencias: novasReferencias
                                        }
                                      }))
                                    }}
                                  >
                                    <SelectTrigger className={getStatusColor(referencia.status)}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                                      <SelectItem value="Reprovado">Reprovado</SelectItem>
                                      <SelectItem value="Pendente">Pendente</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const novasReferencias = [...(selectedSolicitacao.analise?.referencias || []), {
                                nome: "",
                                telefone: "",
                                tipo: "",
                                status: "Pendente"
                              }]
                              setSelectedSolicitacao(prev => ({
                                ...prev!,
                                analise: {
                                  ...prev!.analise!,
                                  referencias: novasReferencias
                                }
                              }))
                            }}
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Adicionar Referência
                          </Button>
                        </div>
                      </div>

                      {/* Seção de Status Geral */}
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-700">
                          <ClipboardCheck className="w-5 h-5" />
                          Status Geral
                        </h2>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Status da Análise</Label>
                            <Select
                              value={selectedSolicitacao.analise?.statusGeral || "Pendente"}
                              onValueChange={(value) => setSelectedSolicitacao(prev => ({
                                ...prev!,
                                analise: {
                                  ...prev!.analise!,
                                  statusGeral: value
                                }
                              }))}
                            >
                              <SelectTrigger className={getStatusColor(selectedSolicitacao.analise?.statusGeral || "Pendente")}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Aprovado">Aprovado</SelectItem>
                                <SelectItem value="Reprovado">Reprovado</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Observações Gerais</Label>
                            <Textarea
                              value={selectedSolicitacao.analise?.observacoesGerais || ""}
                              onChange={(e) => setSelectedSolicitacao(prev => ({
                                ...prev!,
                                analise: {
                                  ...prev!.analise!,
                                  observacoesGerais: e.target.value
                                }
                              }))}
                              placeholder="Observações gerais sobre a análise"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">Selecione uma solicitação para análise</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
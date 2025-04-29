"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/config"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Solicitacao {
  id: string
  fullName: string
  status: string
  rating: number
  documentos: {
    cnh: string
    extratoCnh: string
    analiseFinanceira: string
    crlv: boolean
    antecedentes: boolean
    outros: string[]
  }
  experiencia: {
    anos: number
    empresas: string[]
    observacoes: string
    referencias: {
      nome: string
      telefone: string
      tipo: string
      documentoCliente: boolean
    }[]
  }
}

export default function ReanalisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSolicitacao()
  }, [params.id])

  const fetchSolicitacao = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, "solicitacoes", params.id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setSolicitacao({
          id: docSnap.id,
          ...docSnap.data()
        } as Solicitacao)
      } else {
        console.error("Documento não encontrado")
        router.push("/reprovados")
      }
    } catch (error) {
      console.error("Erro ao buscar solicitação:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!solicitacao) return

    try {
      setSaving(true)
      await updateDoc(doc(db, "solicitacoes", params.id), {
        ...solicitacao,
        status: "Em Reanálise",
        updatedAt: new Date()
      })
      router.push("/reprovados")
    } catch (error) {
      console.error("Erro ao salvar alterações:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!solicitacao) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="px-4 lg:px-6 h-14 sm:h-16 flex items-center border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/reprovados">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Reanálise de Cadastro</h1>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Dados do Cadastro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seção de Documentos */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-green-700">
                  Documentos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnh">CNH</Label>
                    <Select
                      value={solicitacao.documentos.cnh}
                      onValueChange={(value) => setSolicitacao(prev => prev ? {
                        ...prev,
                        documentos: {
                          ...prev.documentos,
                          cnh: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extratoCnh">Extrato da CNH</Label>
                    <Select
                      value={solicitacao.documentos.extratoCnh}
                      onValueChange={(value) => setSolicitacao(prev => prev ? {
                        ...prev,
                        documentos: {
                          ...prev.documentos,
                          extratoCnh: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="analiseFinanceira">Análise Financeira (SERASA)</Label>
                    <Select
                      value={solicitacao.documentos.analiseFinanceira}
                      onValueChange={(value) => setSolicitacao(prev => prev ? {
                        ...prev,
                        documentos: {
                          ...prev.documentos,
                          analiseFinanceira: value
                        }
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Seção de Experiência */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-purple-700">
                  Experiência
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="anos">Anos de Experiência</Label>
                      <Input
                        id="anos"
                        type="number"
                        min="0"
                        value={solicitacao.experiencia.anos}
                        onChange={(e) => setSolicitacao(prev => prev ? {
                          ...prev,
                          experiencia: {
                            ...prev.experiencia,
                            anos: parseInt(e.target.value)
                          }
                        } : null)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={solicitacao.experiencia.observacoes}
                      onChange={(e) => setSolicitacao(prev => prev ? {
                        ...prev,
                        experiencia: {
                          ...prev.experiencia,
                          observacoes: e.target.value
                        }
                      } : null)}
                      placeholder="Observações sobre a experiência"
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Referências */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-orange-700">
                  Referências
                </h2>
                <div className="space-y-4">
                  {solicitacao.experiencia.referencias.map((referencia, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`nome-${index}`}>Nome</Label>
                          <Input
                            id={`nome-${index}`}
                            value={referencia.nome}
                            onChange={(e) => {
                              const novasReferencias = [...solicitacao.experiencia.referencias]
                              novasReferencias[index].nome = e.target.value
                              setSolicitacao(prev => prev ? {
                                ...prev,
                                experiencia: {
                                  ...prev.experiencia,
                                  referencias: novasReferencias
                                }
                              } : null)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`telefone-${index}`}>Telefone</Label>
                          <Input
                            id={`telefone-${index}`}
                            value={referencia.telefone}
                            onChange={(e) => {
                              const novasReferencias = [...solicitacao.experiencia.referencias]
                              novasReferencias[index].telefone = e.target.value
                              setSolicitacao(prev => prev ? {
                                ...prev,
                                experiencia: {
                                  ...prev.experiencia,
                                  referencias: novasReferencias
                                }
                              } : null)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                          <Input
                            id={`tipo-${index}`}
                            value={referencia.tipo}
                            onChange={(e) => {
                              const novasReferencias = [...solicitacao.experiencia.referencias]
                              novasReferencias[index].tipo = e.target.value
                              setSolicitacao(prev => prev ? {
                                ...prev,
                                experiencia: {
                                  ...prev.experiencia,
                                  referencias: novasReferencias
                                }
                              } : null)
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`documentoCliente-${index}`}
                            checked={referencia.documentoCliente}
                            onChange={(e) => {
                              const novasReferencias = [...solicitacao.experiencia.referencias]
                              novasReferencias[index].documentoCliente = e.target.checked
                              setSolicitacao(prev => prev ? {
                                ...prev,
                                experiencia: {
                                  ...prev.experiencia,
                                  referencias: novasReferencias
                                }
                              } : null)
                            }}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label htmlFor={`documentoCliente-${index}`} className="text-sm">
                            Documento Cliente
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
} 
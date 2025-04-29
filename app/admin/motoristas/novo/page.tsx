"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage, collections } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function NewDriver() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    hasRentalExperience: "",
    rentalExperienceType: [] as string[],
    rentalExperienceDetails: "",
    rentalExperienceTime: "",
    hasRentalProblems: "",
    rentalProblemsDetails: "",
    hasRentalDebt: "",
    rentalDebtValue: "",
    rentalDebtReason: "",
    reference1Name: "",
    reference1Relationship: "",
    reference1Phone: "",
    reference2Name: "",
    reference2Relationship: "",
    reference2Phone: "",
  })

  const [files, setFiles] = useState({
    cnh: null as File | null,
    crlv: null as File | null,
    profilePhoto: null as File | null,
    carPhoto: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target
    if (files && files.length > 0) {
      const file = files[0]
      const maxSize = id === "profilePhoto" ? 2 * 1024 * 1024 : 5 * 1024 * 1024 // 2MB para foto de perfil, 5MB para outros
      
      if (file.size > maxSize) {
        alert(`O arquivo ${file.name} excede o tamanho máximo permitido de ${maxSize / (1024 * 1024)}MB`)
        return
      }

      setFiles((prev) => ({ ...prev, [id]: file }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      rentalExperienceType: checked
        ? [...prev.rentalExperienceType, value]
        : prev.rentalExperienceType.filter((type) => type !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload dos arquivos
      const fileUrls: Record<string, string> = {}
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const storageRef = ref(storage, `drivers/${formData.cpf}/${key}_${Date.now()}`)
          await uploadBytes(storageRef, file)
          const downloadUrl = await getDownloadURL(storageRef)
          fileUrls[key] = downloadUrl
        }
      }

      // Salvar dados do motorista
      await addDoc(collection(db, collections.drivers), {
        ...formData,
        status: "pending",
        fileUrls,
        createdAt: serverTimestamp(),
      })

      router.push("/admin/motoristas")
    } catch (error) {
      console.error("Erro ao cadastrar motorista:", error)
      alert("Ocorreu um erro ao cadastrar o motorista. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Novo Motorista</h1>
          <p className="text-gray-500">Cadastre um novo motorista no sistema</p>
        </div>
        <Link href="/admin/motoristas">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do motorista</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Foto de Perfil</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Endereço completo do motorista</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiência com Locação</CardTitle>
            <CardDescription>Histórico de trabalho com locação de veículos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Já trabalhou com locação de veículos?</Label>
              <RadioGroup
                value={formData.hasRentalExperience}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasRentalExperience: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="hasRentalExperience-sim" />
                  <Label htmlFor="hasRentalExperience-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="hasRentalExperience-nao" />
                  <Label htmlFor="hasRentalExperience-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasRentalExperience === "sim" && (
              <>
                <div className="space-y-2">
                  <Label>Tipo de experiência</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="taxi"
                        value="taxi"
                        checked={formData.rentalExperienceType.includes("taxi")}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="taxi">Frota de Taxi / Taxi particular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="app"
                        value="app"
                        checked={formData.rentalExperienceType.includes("app")}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="app">Locadora de carros para apps (Unidas, Movida, Kovi, etc.)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ambos"
                        value="ambos"
                        checked={formData.rentalExperienceType.includes("ambos")}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="ambos">Ambos</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentalExperienceTime">Tempo de experiência</Label>
                  <Input
                    id="rentalExperienceTime"
                    value={formData.rentalExperienceTime}
                    onChange={handleInputChange}
                    placeholder="Ex: 2 anos com taxi de frota, 6 meses com carro da Kovi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentalExperienceDetails">Detalhes da experiência</Label>
                  <Textarea
                    id="rentalExperienceDetails"
                    value={formData.rentalExperienceDetails}
                    onChange={handleInputChange}
                    placeholder="Descreva sua experiência com locação de veículos"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Já teve problemas com locadora ou frota?</Label>
              <RadioGroup
                value={formData.hasRentalProblems}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasRentalProblems: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="hasRentalProblems-sim" />
                  <Label htmlFor="hasRentalProblems-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="hasRentalProblems-nao" />
                  <Label htmlFor="hasRentalProblems-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasRentalProblems === "sim" && (
              <div className="space-y-2">
                <Label htmlFor="rentalProblemsDetails">Detalhe os problemas</Label>
                <Textarea
                  id="rentalProblemsDetails"
                  value={formData.rentalProblemsDetails}
                  onChange={handleInputChange}
                  placeholder="Explique brevemente os problemas ocorridos"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Já deixou alguma dívida com locadora ou frota?</Label>
              <RadioGroup
                value={formData.hasRentalDebt}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasRentalDebt: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="hasRentalDebt-sim" />
                  <Label htmlFor="hasRentalDebt-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="hasRentalDebt-nao" />
                  <Label htmlFor="hasRentalDebt-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasRentalDebt === "sim" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rentalDebtValue">Valor da dívida</Label>
                  <Input
                    id="rentalDebtValue"
                    type="number"
                    value={formData.rentalDebtValue}
                    onChange={handleInputChange}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentalDebtReason">Motivo da dívida</Label>
                  <Textarea
                    id="rentalDebtReason"
                    value={formData.rentalDebtReason}
                    onChange={handleInputChange}
                    placeholder="Explique o motivo da dívida"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Documentos necessários para cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crlv">CRLV</Label>
                <Input
                  id="crlv"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="carPhoto">Foto do Veículo</Label>
              <Input
                id="carPhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referências</CardTitle>
            <CardDescription>Contatos de referência do motorista</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Referência 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference1Name">Nome</Label>
                  <Input
                    id="reference1Name"
                    value={formData.reference1Name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference1Relationship">Relação</Label>
                  <Input
                    id="reference1Relationship"
                    value={formData.reference1Relationship}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference1Phone">Telefone</Label>
                  <Input
                    id="reference1Phone"
                    value={formData.reference1Phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Referência 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference2Name">Nome</Label>
                  <Input
                    id="reference2Name"
                    value={formData.reference2Name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference2Relationship">Relação</Label>
                  <Input
                    id="reference2Relationship"
                    value={formData.reference2Relationship}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference2Phone">Telefone</Label>
                  <Input
                    id="reference2Phone"
                    value={formData.reference2Phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Motorista"}
          </Button>
        </div>
      </form>
    </div>
  )
} 
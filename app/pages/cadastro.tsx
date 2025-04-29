"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Search } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CadastroPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    condutaxi: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName) newErrors.firstName = "Nome é obrigatório"
    if (!formData.lastName) newErrors.lastName = "Sobrenome é obrigatório"
    if (!formData.email) newErrors.email = "Email é obrigatório"
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
    if (!formData.cpf) newErrors.cpf = "CPF é obrigatório"
    if (!formData.condutaxi) newErrors.condutaxi = "Condutaxi é obrigatório"
    if (!formData.cep) newErrors.cep = "CEP é obrigatório"
    if (!formData.street) newErrors.street = "Rua é obrigatória"
    if (!formData.number) newErrors.number = "Número é obrigatório"
    if (!formData.neighborhood) newErrors.neighborhood = "Bairro é obrigatório"
    if (!formData.city) newErrors.city = "Cidade é obrigatória"
    if (!formData.state) newErrors.state = "Estado é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Salvar dados no Firestore
      const requestData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, "requests"), requestData)
      setFormSubmitted(true)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      alert("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    let formattedValue = value

    if (id === 'phone') {
      formattedValue = formatPhone(value)
    } else if (id === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (id === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8)
      setCepError("")
    }

    setFormData((prev) => ({
      ...prev,
      [id]: formattedValue,
    }))
  }

  const handleCepSearch = async (cep: string) => {
    if (cep.length !== 8) {
      setCepError("CEP deve ter 8 dígitos")
      return
    }

    setIsLoadingCep(true)
    setCepError("")
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        setCepError("CEP não encontrado")
        return
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }))
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setCepError("Erro ao buscar CEP. Tente novamente.")
    } finally {
      setIsLoadingCep(false)
    }
  }

  if (formSubmitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <Image
              src="/images/logos/logo-grupo-michelines.png"
              alt="Logo Grupo Michelines"
              width={150}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Solicitação Recebida!</CardTitle>
              <CardDescription>
                Obrigado por se cadastrar no Grupo Michelines. Analisaremos suas informações e entraremos em contato em
                breve.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a página inicial
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500">© 2025 Grupo Michelines. Todos os direitos reservados.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 sm:h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Image
            src="/images/logos/logo-grupo-michelines.png"
            alt="Logo Grupo Michelines"
            width={150}
            height={50}
            className="h-8 sm:h-10 w-auto"
          />
        </Link>
      </header>
      <main className="flex-1 py-6 sm:py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                Solicitar Cadastro
              </h1>
              <p className="max-w-[600px] text-sm sm:text-base md:text-lg text-gray-500">
                Preencha o formulário abaixo para solicitar seu cadastro no Grupo Michelines
              </p>
            </div>
          </div>
          <div className="mx-auto mt-6 sm:mt-8 max-w-2xl">
            <Card className="w-full">
              <CardContent className="pt-4 sm:pt-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm sm:text-base">Nome</Label>
                        <Input
                          id="firstName"
                          placeholder="Digite seu nome"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm sm:text-base">Sobrenome</Label>
                        <Input
                          id="lastName"
                          placeholder="Digite seu sobrenome"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                      <Input
                        id="email"
                        placeholder="Digite seu email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm sm:text-base">Telefone</Label>
                        <Input
                          id="phone"
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          maxLength={15}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-sm sm:text-base">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          required
                          maxLength={14}
                          className={errors.cpf ? "border-red-500" : ""}
                        />
                        {errors.cpf && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.cpf}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-sm sm:text-base">CEP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cep"
                          placeholder="00000000"
                          value={formData.cep}
                          onChange={handleInputChange}
                          required
                          maxLength={8}
                          className={errors.cep || cepError ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleCepSearch(formData.cep)}
                          disabled={isLoadingCep || formData.cep.length !== 8}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      {(errors.cep || cepError) && (
                        <p className="text-xs sm:text-sm text-red-500">{errors.cep || cepError}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street" className="text-sm sm:text-base">Rua</Label>
                        <Input
                          id="street"
                          placeholder="Nome da rua"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          className={errors.street ? "border-red-500" : ""}
                        />
                        {errors.street && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.street}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="number" className="text-sm sm:text-base">Número</Label>
                        <Input
                          id="number"
                          placeholder="Número"
                          value={formData.number}
                          onChange={handleInputChange}
                          required
                          className={errors.number ? "border-red-500" : ""}
                        />
                        {errors.number && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.number}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement" className="text-sm sm:text-base">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Complemento (opcional)"
                          value={formData.complement}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood" className="text-sm sm:text-base">Bairro</Label>
                        <Input
                          id="neighborhood"
                          placeholder="Bairro"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          required
                          className={errors.neighborhood ? "border-red-500" : ""}
                        />
                        {errors.neighborhood && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.neighborhood}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm sm:text-base">Cidade</Label>
                        <Input
                          id="city"
                          placeholder="Cidade"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm sm:text-base">Estado</Label>
                        <Input
                          id="state"
                          placeholder="Estado"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && (
                          <p className="text-xs sm:text-sm text-red-500">{errors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                    <Link href="/" className="w-full sm:w-auto">
                      <Button type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-4 sm:py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 Grupo Michelines. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
} 
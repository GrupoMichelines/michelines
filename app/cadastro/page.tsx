"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Search, Star } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CadastroPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    condutax: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    rating: 0,
    status: "Pendente"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName) newErrors.firstName = "Nome é obrigatório"
    if (!formData.lastName) newErrors.lastName = "Sobrenome é obrigatório"
    
    // Validação de email
    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    
    // Validação de telefone
    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Telefone inválido"
    }
    
    // Validação de CPF
    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }
    
    if (!formData.condutax) newErrors.condutax = "CONDUTAX é obrigatório"
    
    // Validação de CEP
    if (!formData.cep) {
      newErrors.cep = "CEP é obrigatório"
    } else if (formData.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = "CEP inválido"
    }
    
    if (!formData.street) newErrors.street = "Rua/AV é obrigatória"
    if (!formData.number) newErrors.number = "Número é obrigatório"
    if (!formData.neighborhood) newErrors.neighborhood = "Bairro é obrigatório"
    if (!formData.city) newErrors.city = "Cidade é obrigatória"
    if (!formData.state) newErrors.state = "Estado é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função para validar CPF
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '')
    if (cpf.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit > 9) digit = 0
    if (digit !== parseInt(cpf.charAt(9))) return false
    
    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit > 9) digit = 0
    if (digit !== parseInt(cpf.charAt(10))) return false
    
    return true
  }

  const handleRating = (value: number) => {
    setRating(value)
    setFormData(prev => ({ ...prev, rating: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Iniciando envio do formulário...")
      console.log("Configuração do Firebase:", db)

      // Salvar dados no Firestore
      const requestData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: "Aguardar",
        rating: rating,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        analises: [],
        documentos: {
          cnh: false,
          cpf: false,
          condutax: false,
          comprovanteResidencia: false
        },
        experiencia: {
          anos: 0,
          tipoVeiculo: "",
          empresasAnteriores: []
        },
        referencias: []
      }

      console.log("Dados a serem salvos:", requestData)

      try {
        // Salvar na coleção de solicitações
        const docRef = await addDoc(collection(db, "solicitacoes"), requestData)
        console.log("Documento salvo com sucesso na coleção 'solicitacoes':", docRef.id)
        
        // Criar notificação para o painel admin
        const notificationData = {
          type: "nova_solicitacao",
          title: "Nova Solicitação de Cadastro",
          message: `Nova solicitação recebida de ${formData.firstName} ${formData.lastName} - Avaliação: ${rating} estrelas`,
          status: "Aguardar",
          rating: rating,
          createdAt: serverTimestamp(),
          read: false,
          solicitacaoId: docRef.id
        }
        
        const notificationRef = await addDoc(collection(db, "notificacoes"), notificationData)
        console.log("Notificação criada com sucesso:", notificationRef.id)

        setFormSubmitted(true)
      } catch (firestoreError) {
        console.error("Erro específico do Firestore:", firestoreError)
        throw firestoreError
      }
    } catch (error) {
      console.error("Erro completo ao enviar formulário:", error)
      alert("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else if (numbers.length <= 11) {
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

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
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
      formattedValue = formatCEP(value)
      if (formattedValue.length === 9) {
        handleCepSearch(formattedValue.replace(/\D/g, ''))
      }
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
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
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
                Obrigado por se cadastrar no Grupo Michelines. Analisaremos suas informações e entraremos em contato em breve.
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastro de Motorista</h2>
          
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-gray-700">Enviando cadastro...</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.cpf ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                )}
              </div>

              <div>
                <label htmlFor="condutax" className="block text-sm font-medium text-gray-700">
                  CONDUTAX
                </label>
                <input
                  type="text"
                  id="condutax"
                  value={formData.condutax}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.condutax ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.condutax && (
                  <p className="mt-1 text-sm text-red-600">{errors.condutax}</p>
                )}
              </div>

              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.cep || cepError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {(errors.cep || cepError) && (
                  <p className="mt-1 text-sm text-red-600">{errors.cep || cepError}</p>
                )}
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Rua/AV
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  id="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.number ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                )}
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.neighborhood ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Cadastro'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}   
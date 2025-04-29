"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DriverStatus } from "@/app/types"

interface DriverFormProps {
  onSuccess: () => void
}

export function DriverForm({ onSuccess }: DriverFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
    hasRentalExperience: "false",
    rentalExperienceType: "",
    rentalExperienceDetails: "",
    rentalExperienceTime: "",
    hasRentalProblems: "false",
    rentalProblemsDetails: "",
    hasRentalDebt: "false",
    rentalDebtValue: "",
    rentalDebtReason: "",
    reference1Name: "",
    reference1Phone: "",
    reference2Name: "",
    reference2Phone: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const driverData = {
        ...formData,
        hasRentalExperience: formData.hasRentalExperience === "true",
        hasRentalProblems: formData.hasRentalProblems === "true",
        hasRentalDebt: formData.hasRentalDebt === "true",
        status: "pending" as DriverStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, "drivers"), driverData)
      onSuccess()
    } catch (error) {
      console.error("Error submitting driver:", error)
      setError("Ocorreu um erro ao registrar o motorista. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={formData.cpf}
          onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Endereço</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={formData.complement}
              onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Experiência com Locação</h3>
        <div className="space-y-2">
          <Label>Possui experiência com locação?</Label>
          <Select
            value={formData.hasRentalExperience}
            onValueChange={(value) => setFormData(prev => ({ ...prev, hasRentalExperience: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.hasRentalExperience === "true" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentalExperienceType">Tipo de Experiência</Label>
                <Input
                  id="rentalExperienceType"
                  value={formData.rentalExperienceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalExperienceType: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentalExperienceTime">Tempo de Experiência</Label>
                <Input
                  id="rentalExperienceTime"
                  value={formData.rentalExperienceTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalExperienceTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentalExperienceDetails">Detalhes da Experiência</Label>
              <Textarea
                id="rentalExperienceDetails"
                value={formData.rentalExperienceDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, rentalExperienceDetails: e.target.value }))}
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Problemas com Locação</h3>
        <div className="space-y-2">
          <Label>Possui problemas com locação?</Label>
          <Select
            value={formData.hasRentalProblems}
            onValueChange={(value) => setFormData(prev => ({ ...prev, hasRentalProblems: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.hasRentalProblems === "true" && (
          <div className="space-y-2">
            <Label htmlFor="rentalProblemsDetails">Detalhes dos Problemas</Label>
            <Textarea
              id="rentalProblemsDetails"
              value={formData.rentalProblemsDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, rentalProblemsDetails: e.target.value }))}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Dívidas com Locação</h3>
        <div className="space-y-2">
          <Label>Possui dívidas com locação?</Label>
          <Select
            value={formData.hasRentalDebt}
            onValueChange={(value) => setFormData(prev => ({ ...prev, hasRentalDebt: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.hasRentalDebt === "true" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentalDebtValue">Valor da Dívida</Label>
                <Input
                  id="rentalDebtValue"
                  value={formData.rentalDebtValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalDebtValue: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentalDebtReason">Motivo da Dívida</Label>
                <Input
                  id="rentalDebtReason"
                  value={formData.rentalDebtReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentalDebtReason: e.target.value }))}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Referências</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reference1Name">Nome da Referência 1</Label>
            <Input
              id="reference1Name"
              value={formData.reference1Name}
              onChange={(e) => setFormData(prev => ({ ...prev, reference1Name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference1Phone">Telefone da Referência 1</Label>
            <Input
              id="reference1Phone"
              value={formData.reference1Phone}
              onChange={(e) => setFormData(prev => ({ ...prev, reference1Phone: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reference2Name">Nome da Referência 2</Label>
            <Input
              id="reference2Name"
              value={formData.reference2Name}
              onChange={(e) => setFormData(prev => ({ ...prev, reference2Name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference2Phone">Telefone da Referência 2</Label>
            <Input
              id="reference2Phone"
              value={formData.reference2Phone}
              onChange={(e) => setFormData(prev => ({ ...prev, reference2Phone: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onSuccess()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Motorista"}
        </Button>
      </div>
    </form>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFirebaseForm } from '@/hooks/useFirebase'
import { VehicleService } from '@/lib/services'
import { Vehicle } from '@/types/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function NewVehiclePage() {
  const router = useRouter()
  const { submitting, error, handleSubmit } = useFirebaseForm<Vehicle>({
    onSuccess: () => router.push('/admin/veiculos')
  })

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    categoria: '',
    combustivel: '',
    valor_diaria: '',
    valor_semanal: '',
    valor_mensal: '',
    caracteristicas: [] as string[],
    imagem_url: '/placeholder.svg',
    disponivel: true,
    destaque: false,
    acessivel: false
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleCaracteristicasChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const caracteristicas = e.target.value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, caracteristicas }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Converter valores monetários para números
    const data = {
      ...formData,
      valor_diaria: Number(formData.valor_diaria),
      valor_semanal: Number(formData.valor_semanal),
      valor_mensal: Number(formData.valor_mensal)
    }

    await handleSubmit(() => VehicleService.create(data))
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="combustivel">Combustível</Label>
                <Input
                  id="combustivel"
                  name="combustivel"
                  value={formData.combustivel}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_diaria">Valor Diária (R$)</Label>
                <Input
                  id="valor_diaria"
                  name="valor_diaria"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor_diaria}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_semanal">Valor Semanal (R$)</Label>
                <Input
                  id="valor_semanal"
                  name="valor_semanal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor_semanal}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_mensal">Valor Mensal (R$)</Label>
                <Input
                  id="valor_mensal"
                  name="valor_mensal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor_mensal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caracteristicas">
                Características (uma por linha)
              </Label>
              <Textarea
                id="caracteristicas"
                value={formData.caracteristicas.join('\n')}
                onChange={handleCaracteristicasChange}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disponivel"
                  checked={formData.disponivel}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('disponivel', checked as boolean)
                  }
                />
                <Label htmlFor="disponivel">Disponível para aluguel</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('destaque', checked as boolean)
                  }
                />
                <Label htmlFor="destaque">Exibir em destaque</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acessivel"
                  checked={formData.acessivel}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('acessivel', checked as boolean)
                  }
                />
                <Label htmlFor="acessivel">Veículo adaptado/acessível</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
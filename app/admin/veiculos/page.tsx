'use client'

import { useEffect } from 'react'
import { useFirebase } from '@/hooks/useFirebase'
import { VehicleService } from '@/lib/services'
import { Vehicle } from '@/types/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function VehiclesPage() {
  const { 
    loading, 
    error, 
    data: vehicles,
    execute 
  } = useFirebase<Vehicle[]>()

  useEffect(() => {
    execute(() => VehicleService.getAll())
  }, [execute])

  const handleToggleAvailability = async (id: string, disponivel: boolean) => {
    await execute(async () => {
      await VehicleService.toggleAvailability(id, !disponivel)
      return VehicleService.getAll()
    })
  }

  const handleToggleFeatured = async (id: string, destaque: boolean) => {
    await execute(async () => {
      await VehicleService.toggleFeatured(id, !destaque)
      return VehicleService.getAll()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">Erro ao carregar veículos: {error.message}</p>
        <Button onClick={() => execute(() => VehicleService.getAll())}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Link href="/admin/veiculos/novo">
          <Button>Adicionar Veículo</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>
                  {vehicle.marca} {vehicle.modelo}
                </span>
                <div className="flex gap-2">
                  <Badge variant={vehicle.disponivel ? "success" : "secondary"}>
                    {vehicle.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                  {vehicle.destaque && (
                    <Badge variant="default">Destaque</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p>{vehicle.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ano</p>
                  <p>{vehicle.ano}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valores</p>
                  <ul className="list-disc list-inside">
                    <li>Diária: R$ {vehicle.valor_diaria}</li>
                    <li>Semanal: R$ {vehicle.valor_semanal}</li>
                    <li>Mensal: R$ {vehicle.valor_mensal}</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleAvailability(vehicle.id, vehicle.disponivel)}
                  >
                    {vehicle.disponivel ? "Marcar Indisponível" : "Marcar Disponível"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleFeatured(vehicle.id, vehicle.destaque)}
                  >
                    {vehicle.destaque ? "Remover Destaque" : "Marcar Destaque"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
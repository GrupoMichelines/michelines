"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, AlertCircle, Edit, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Driver, DriverStatus } from "@/app/types"

export default function AdminUsers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<DriverStatus | "all">("all")

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversQuery = query(collection(db, "drivers"), orderBy("createdAt", "desc"))
        const driversSnapshot = await getDocs(driversQuery)
        const driversData = driversSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status as DriverStatus
        })) as Driver[]
        setDrivers(driversData)
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.cpf.includes(searchTerm)
    
    const matchesTab = activeTab === "all" || driver.status === activeTab
    
    return matchesSearch && matchesTab
  })

  const handleUpdateStatus = async (driverId: string, newStatus: DriverStatus) => {
    try {
      const driverRef = doc(db, "drivers", driverId)
      await updateDoc(driverRef, { status: newStatus })
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, status: newStatus } : driver
      ))
    } catch (error) {
      console.error("Error updating driver status:", error)
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm("Tem certeza que deseja excluir este motorista?")) return
    
    try {
      await deleteDoc(doc(db, "drivers", driverId))
      setDrivers(prev => prev.filter(driver => driver.id !== driverId))
    } catch (error) {
      console.error("Error deleting driver:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciamento de Motoristas</h1>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar motorista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DriverStatus | "all")}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Telefone</th>
                <th className="h-12 px-4 text-left align-middle font-medium">CPF</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Data de Cadastro</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">{`${driver.firstName} ${driver.lastName}`}</td>
                  <td className="p-4 align-middle">{driver.email}</td>
                  <td className="p-4 align-middle">{driver.phone}</td>
                  <td className="p-4 align-middle">{driver.cpf}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      driver.status === "active" ? "default" :
                      driver.status === "pending" ? "secondary" :
                      "destructive"
                    }>
                      {driver.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {new Date(driver.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      {driver.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(driver.id, "active")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(driver.id, "inactive")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                      {driver.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(driver.id, "inactive")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Desativar
                        </Button>
                      )}
                      {driver.status === "inactive" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(driver.id, "active")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Reativar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDriver(driver.id)}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 
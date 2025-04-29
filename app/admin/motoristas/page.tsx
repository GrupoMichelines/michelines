"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc, where } from "firebase/firestore"
import { db, collections } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Check, X, FileText, Pencil, Trash2, Star, Car, Archive, MoreHorizontal, AlertCircle, Edit, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Driver, DriverStatus } from "@/app/types"
import { DriverForm } from "./form"

interface Evaluation {
  id: string
  driverId: string
  driverName: string
  rating: number
  comment: string
  status: "pending" | "published" | "archived"
  createdAt: string
}

interface RentalRequest {
  id: string
  driverId: string
  driverName: string
  vehicleType: string
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<DriverStatus | "all">("all")
  const [showForm, setShowForm] = useState(false)

  // Evaluations state
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])

  // Rental requests state
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([])
  const [filteredRentalRequests, setFilteredRentalRequests] = useState<RentalRequest[]>([])

  useEffect(() => {
    fetchDrivers()
  }, [])

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
      await updateDoc(doc(db, "drivers", driverId), { status: newStatus })
      setDrivers(drivers.map(driver => 
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
      setDrivers(drivers.filter(driver => driver.id !== driverId))
    } catch (error) {
      console.error("Error deleting driver:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Motoristas</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Motorista
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Motorista</CardTitle>
            <CardDescription>
              Preencha os dados do motorista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DriverForm 
              onSuccess={() => {
                setShowForm(false)
                fetchDrivers()
              }} 
            />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Buscar por nome, e-mail, telefone ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DriverStatus | "all")}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.firstName} {driver.lastName}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.cpf}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    driver.status === "active" ? "bg-green-100 text-green-700" :
                    driver.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {driver.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(driver.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {driver.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "active")}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "inactive")}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {driver.status === "active" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "inactive")}>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                      {driver.status === "inactive" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(driver.id, "active")}>
                          <Check className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDeleteDriver(driver.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 
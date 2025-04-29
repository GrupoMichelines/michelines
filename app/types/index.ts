export type DriverStatus = "active" | "pending" | "inactive"
export type EvaluationStatus = "pending" | "published" | "archived"
export type RentalStatus = "pending" | "approved" | "rejected"

export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf: string
  status: DriverStatus
  createdAt: string
}

export interface Evaluation {
  id: string
  driverId: string
  driverName: string
  rating: number
  comment: string
  status: EvaluationStatus
  createdAt: string
}

export interface RentalRequest {
  id: string
  driverId: string
  driverName: string
  vehicleType: string
  startDate: string
  endDate: string
  status: RentalStatus
  createdAt: string
} 
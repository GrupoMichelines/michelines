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
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  cep?: string
  hasRentalExperience?: boolean
  rentalExperienceType?: string
  rentalExperienceDetails?: string
  rentalExperienceTime?: string
  hasRentalProblems?: boolean
  rentalProblemsDetails?: string
  hasRentalDebt?: boolean
  rentalDebtValue?: string
  rentalDebtReason?: string
  reference1Name?: string
  reference1Phone?: string
  reference2Name?: string
  reference2Phone?: string
}

export interface Evaluation {
  id: string
  driverId: string
  driverName: string
  rating: number
  comment: string
  status: EvaluationStatus
  createdAt: string
  evaluatorName: string
  evaluatorRole: string
  vehicleType: string
  rentalPeriod: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string
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
  totalDays: number
  dailyRate: number
  totalAmount: number
  paymentStatus: "pending" | "paid" | "overdue"
  documents: {
    cnh: string
    crlv: string
    insurance: string
  }
  notes?: string
} 
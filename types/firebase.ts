import { Timestamp } from 'firebase/firestore'

export interface BaseEntity {
  id: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Vehicle extends BaseEntity {
  marca: string
  modelo: string
  ano: string
  categoria: string
  combustivel: string
  valor_diaria: number
  valor_semanal: number
  valor_mensal: number
  caracteristicas: string[]
  imagem_url: string
  disponivel: boolean
  destaque: boolean
  acessivel: boolean
}

export interface Driver extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  status: 'pending' | 'approved' | 'rejected'
  hasRentalExperience: boolean
  rentalExperienceType: string[]
  rentalExperienceDetails?: string
  rentalExperienceTime?: string
  hasRentalProblems: boolean
  rentalProblemsDetails?: string
  hasRentalDebt: boolean
  rentalDebtValue?: string
  rentalDebtReason?: string
  reference1Name: string
  reference1Relationship: string
  reference1Phone: string
  reference2Name: string
  reference2Relationship: string
  reference2Phone: string
  fileUrls?: {
    cnh?: string
    crlv?: string
    profilePhoto?: string
    carPhoto?: string
  }
}

export interface Rental extends BaseEntity {
  driverId: string
  vehicleId: string
  startDate: Timestamp
  endDate: Timestamp
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  totalValue: number
  paymentStatus: 'pending' | 'paid' | 'partial'
  observations?: string
}

export interface Evaluation extends BaseEntity {
  driverId: string
  rating: number
  comment: string
  evaluatorName: string
  evaluatorEmail?: string
  isPublic: boolean
}

export interface Article extends BaseEntity {
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  imagem_url: string
  autor: string
  categoria: string
  tags: string[]
  tempo_leitura: string
  publicado: boolean
  destaque: boolean
}

export interface HeroBanner extends BaseEntity {
  titulo: string
  subtitulo?: string
  imagem_url: string
  link?: string
  ativo: boolean
  ordem: number
} 
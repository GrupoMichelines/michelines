import { Rental } from '@/types/firebase'
import { 
  COLLECTIONS,
  getDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  queryBuilder
} from '@/lib/firebase-service'
import { where } from 'firebase/firestore'

export const RentalService = {
  getAll: async () => {
    return getDocuments<Rental>(COLLECTIONS.RENTALS)
  },

  getById: async (id: string) => {
    return getDocumentById<Rental>(COLLECTIONS.RENTALS, id)
  },

  getByDriver: async (driverId: string) => {
    return getDocuments<Rental>(COLLECTIONS.RENTALS, [
      where('driverId', '==', driverId),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getByVehicle: async (vehicleId: string) => {
    return getDocuments<Rental>(COLLECTIONS.RENTALS, [
      where('vehicleId', '==', vehicleId),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getByStatus: async (status: Rental['status']) => {
    return getDocuments<Rental>(COLLECTIONS.RENTALS, [
      where('status', '==', status),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getActive: async () => {
    return getDocuments<Rental>(COLLECTIONS.RENTALS, [
      where('status', '==', 'active'),
      queryBuilder.orderByDate('created_at')
    ])
  },

  create: async (data: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => {
    return addDocument<Rental>(COLLECTIONS.RENTALS, data)
  },

  update: async (id: string, data: Partial<Omit<Rental, 'id' | 'created_at'>>) => {
    return updateDocument<Rental>(COLLECTIONS.RENTALS, id, data)
  },

  delete: async (id: string) => {
    return deleteDocument(COLLECTIONS.RENTALS, id)
  },

  updateStatus: async (id: string, status: Rental['status']) => {
    return updateDocument<Rental>(COLLECTIONS.RENTALS, id, { status })
  },

  updatePaymentStatus: async (id: string, paymentStatus: Rental['paymentStatus']) => {
    return updateDocument<Rental>(COLLECTIONS.RENTALS, id, { paymentStatus })
  }
} 
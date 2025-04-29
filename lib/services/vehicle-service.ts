import { Vehicle } from '@/types/firebase'
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

export const VehicleService = {
  getAll: async () => {
    return getDocuments<Vehicle>(COLLECTIONS.VEHICLES)
  },

  getById: async (id: string) => {
    return getDocumentById<Vehicle>(COLLECTIONS.VEHICLES, id)
  },

  getAvailable: async () => {
    return getDocuments<Vehicle>(COLLECTIONS.VEHICLES, [
      where('disponivel', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getFeatured: async () => {
    return getDocuments<Vehicle>(COLLECTIONS.VEHICLES, [
      where('destaque', '==', true),
      where('disponivel', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getAccessible: async () => {
    return getDocuments<Vehicle>(COLLECTIONS.VEHICLES, [
      where('acessivel', '==', true),
      where('disponivel', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  create: async (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    return addDocument<Vehicle>(COLLECTIONS.VEHICLES, data)
  },

  update: async (id: string, data: Partial<Omit<Vehicle, 'id' | 'created_at'>>) => {
    return updateDocument<Vehicle>(COLLECTIONS.VEHICLES, id, data)
  },

  delete: async (id: string) => {
    return deleteDocument(COLLECTIONS.VEHICLES, id)
  },

  toggleAvailability: async (id: string, disponivel: boolean) => {
    return updateDocument<Vehicle>(COLLECTIONS.VEHICLES, id, { disponivel })
  },

  toggleFeatured: async (id: string, destaque: boolean) => {
    return updateDocument<Vehicle>(COLLECTIONS.VEHICLES, id, { destaque })
  }
} 
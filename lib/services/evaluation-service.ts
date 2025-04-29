import { Evaluation } from '@/types/firebase'
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

export const EvaluationService = {
  getAll: async () => {
    return getDocuments<Evaluation>(COLLECTIONS.EVALUATIONS)
  },

  getById: async (id: string) => {
    return getDocumentById<Evaluation>(COLLECTIONS.EVALUATIONS, id)
  },

  getByDriver: async (driverId: string) => {
    return getDocuments<Evaluation>(COLLECTIONS.EVALUATIONS, [
      where('driverId', '==', driverId),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getPublic: async () => {
    return getDocuments<Evaluation>(COLLECTIONS.EVALUATIONS, [
      where('isPublic', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getPublicByDriver: async (driverId: string) => {
    return getDocuments<Evaluation>(COLLECTIONS.EVALUATIONS, [
      where('driverId', '==', driverId),
      where('isPublic', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  create: async (data: Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>) => {
    return addDocument<Evaluation>(COLLECTIONS.EVALUATIONS, data)
  },

  update: async (id: string, data: Partial<Omit<Evaluation, 'id' | 'created_at'>>) => {
    return updateDocument<Evaluation>(COLLECTIONS.EVALUATIONS, id, data)
  },

  delete: async (id: string) => {
    return deleteDocument(COLLECTIONS.EVALUATIONS, id)
  },

  togglePublic: async (id: string, isPublic: boolean) => {
    return updateDocument<Evaluation>(COLLECTIONS.EVALUATIONS, id, { isPublic })
  }
} 
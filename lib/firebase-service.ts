import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/app/firebase/config'
import { BaseEntity } from '@/types/firebase'

// Tipos de erro personalizados
export class FirebaseError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'FirebaseError'
  }
}

// Função para converter dados do Firestore
export const convertFirestoreData = <T extends BaseEntity>(
  doc: DocumentData
): T => {
  const data = doc.data()
  const id = doc.id

  // Converter timestamps para o formato correto
  const convertedData: any = { ...data, id }

  // Garantir que created_at e updated_at sejam sempre Timestamp
  if (!(data.created_at instanceof Timestamp)) {
    convertedData.created_at = Timestamp.now()
  }
  if (!(data.updated_at instanceof Timestamp)) {
    convertedData.updated_at = Timestamp.now()
  }

  return convertedData as T
}

// Função genérica para buscar documentos
export const getDocuments = async <T extends BaseEntity>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints)
      : query(collectionRef)
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => convertFirestoreData<T>(doc))
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao buscar documentos da coleção ${collectionName}: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função genérica para buscar um documento por ID
export const getDocumentById = async <T extends BaseEntity>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return convertFirestoreData<T>(docSnap)
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao buscar documento ${id} da coleção ${collectionName}: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função genérica para adicionar um documento
export const addDocument = async <T extends BaseEntity>(
  collectionName: string,
  data: Omit<T, 'id' | 'created_at' | 'updated_at'>
): Promise<T> => {
  try {
    const dataWithTimestamps = {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamps)
    const newDoc = await getDoc(docRef)
    
    return convertFirestoreData<T>(newDoc)
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao adicionar documento à coleção ${collectionName}: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função genérica para atualizar um documento
export const updateDocument = async <T extends BaseEntity>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, 'id' | 'created_at'>>
): Promise<T> => {
  try {
    const docRef = doc(db, collectionName, id)
    const updateData = {
      ...data,
      updated_at: serverTimestamp()
    }
    
    await updateDoc(docRef, updateData)
    const updatedDoc = await getDoc(docRef)
    
    return convertFirestoreData<T>(updatedDoc)
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao atualizar documento ${id} da coleção ${collectionName}: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função genérica para deletar um documento
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, id))
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao deletar documento ${id} da coleção ${collectionName}: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função para upload de arquivo
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao fazer upload do arquivo: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Função para deletar arquivo
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error: any) {
    throw new FirebaseError(
      `Erro ao deletar arquivo: ${error.message}`,
      error.code || 'unknown'
    )
  }
}

// Constantes para nomes de coleções
export const COLLECTIONS = {
  VEHICLES: 'vehicles',
  DRIVERS: 'drivers',
  RENTALS: 'rentals',
  EVALUATIONS: 'evaluations',
  ARTICLES: 'articles',
  HERO_BANNERS: 'hero_banners'
} as const

// Funções de consulta comuns
export const queryBuilder = {
  active: () => where('active', '==', true),
  orderByDate: (field: 'created_at' | 'updated_at', direction: 'asc' | 'desc' = 'desc') => 
    orderBy(field, direction),
  limit: (n: number) => limit(n),
  byStatus: (status: string) => where('status', '==', status)
} 
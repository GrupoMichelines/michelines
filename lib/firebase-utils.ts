import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, QueryConstraint, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore"
import { db, Veiculo, Avaliacao, HeroBanner, Artigo } from "./firebase"

// Função para converter Timestamp para string ISO
export const convertTimestampToISO = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString()
}

// Função para converter dados do Firestore para o formato da aplicação
export const convertFirestoreData = <T>(doc: any): T => {
  const data = doc.data()
  const id = doc.id

  // Converter timestamps para strings ISO
  const convertedData: any = { ...data, id }

  if (data.created_at instanceof Timestamp) {
    convertedData.created_at = convertTimestampToISO(data.created_at)
  }

  if (data.updated_at instanceof Timestamp) {
    convertedData.updated_at = convertTimestampToISO(data.updated_at)
  }

  return convertedData as T
}

// Funções genéricas para CRUD
export const getCollection = async <T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef)
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => convertFirestoreData<T>(doc))
  } catch (error: any) {
    console.error(`Erro ao buscar coleção ${collectionName}:`, error)
    return [] // Retornar array vazio em caso de erro
  }
}

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) {
      return null
    }
    
    return convertFirestoreData<T>(snapshot)
  } catch (error: any) {
    console.error(`Erro ao buscar documento ${id} da coleção ${collectionName}:`, error)
    return null
  }
}

export const addDocument = async <T>(collectionName: string, data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> => {
  try {
    const collectionRef = collection(db, collectionName)
    
    // Adicionar timestamps
    const dataWithTimestamps = {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }
    
    const docRef = await addDoc(collectionRef, dataWithTimestamps)
    const newDoc = await getDoc(docRef)
    
    return convertFirestoreData<T>(newDoc)
  } catch (error: any) {
    console.error(`Erro ao adicionar documento à coleção ${collectionName}:`, error)
    return null
  }
}

export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id)
    
    // Adicionar timestamp de atualização
    const dataWithTimestamp = {
      ...data,
      updated_at: serverTimestamp()
    }
    
    await updateDoc(docRef, dataWithTimestamp as any)
    const updatedDoc = await getDoc(docRef)
    
    return convertFirestoreData<T>(updatedDoc)
  } catch (error: any) {
    console.error(`Erro ao atualizar documento ${id} da coleção ${collectionName}:`, error)
    return null
  }
}

export const deleteDocument = async (collectionName: string, id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    return true
  } catch (error: any) {
    console.error(`Erro ao excluir documento ${id} da coleção ${collectionName}:`, error)
    return false
  }
}

// Funções específicas para veículos
export const getVeiculos = async (options?: {
  categoria?: string,
  destaque?: boolean,
  disponivel?: boolean
}): Promise<Veiculo[]> => {
  try {
    const constraints: QueryConstraint[] = []
    
    // Adicionar ordenação apenas se houver documentos
    // Isso evita erros se a coleção estiver vazia
    constraints.push(orderBy('created_at', 'desc'))
    
    if (options?.categoria && options.categoria !== 'todos') {
      constraints.push(where('categoria', '==', options.categoria))
    }
    
    if (options?.destaque === true) {
      constraints.push(where('destaque', '==', true))
    }
    
    if (options?.disponivel === true) {
      constraints.push(where('disponivel', '==', true))
    }
    
    return getCollection<Veiculo>('veiculos', constraints)
  } catch (error: any) {
    console.error('Erro ao buscar veículos:', error)
    return []
  }
}

export const getVeiculo = async (id: string): Promise<Veiculo | null> => {
  return getDocument<Veiculo>('veiculos', id)
}

// Funções específicas para avaliações
export const getAvaliacoes = async (options?: {
  status?: 'pendente' | 'aprovado' | 'reprovado'
}): Promise<Avaliacao[]> => {
  try {
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')]
    
    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }
    
    return getCollection<Avaliacao>('avaliacoes', constraints)
  } catch (error: any) {
    console.error('Erro ao buscar avaliações:', error)
    return []
  }
}

// Funções específicas para banners
export const getHeroBanners = async (onlyActive: boolean = false): Promise<HeroBanner[]> => {
  try {
    const constraints: QueryConstraint[] = [orderBy('ordem', 'asc')]
    
    if (onlyActive) {
      constraints.push(where('ativo', '==', true))
    }
    
    return getCollection<HeroBanner>('hero_banners', constraints)
  } catch (error: any) {
    console.error('Erro ao buscar banners:', error)
    return []
  }
}

// Funções específicas para artigos
export const getArtigos = async (options?: {
  publicado?: boolean,
  destaque?: boolean,
  categoria?: string
}): Promise<Artigo[]> => {
  try {
    const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')]
    
    if (options?.publicado !== undefined) {
      constraints.push(where('publicado', '==', options.publicado))
    }
    
    if (options?.destaque === true) {
      constraints.push(where('destaque', '==', true))
    }
    
    if (options?.categoria) {
      constraints.push(where('categoria', '==', options.categoria))
    }
    
    return getCollection<Artigo>('artigos', constraints)
  } catch (error: any) {
    console.error('Erro ao buscar artigos:', error)
    return []
  }
}

export const getArtigoBySlug = async (slug: string): Promise<Artigo | null> => {
  try {
    const artigosRef = collection(db, 'artigos')
    const q = query(artigosRef, where('slug', '==', slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return null
    }
    
    return convertFirestoreData<Artigo>(snapshot.docs[0])
  } catch (error: any) {
    console.error(`Erro ao buscar artigo com slug ${slug}:`, error)
    return null
  }
}


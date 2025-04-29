import { Driver } from '@/types/firebase'
import { 
  COLLECTIONS,
  getDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  queryBuilder,
  uploadFile,
  deleteFile
} from '@/lib/firebase-service'
import { where } from 'firebase/firestore'

export const DriverService = {
  getAll: async () => {
    return getDocuments<Driver>(COLLECTIONS.DRIVERS)
  },

  getById: async (id: string) => {
    return getDocumentById<Driver>(COLLECTIONS.DRIVERS, id)
  },

  getByStatus: async (status: Driver['status']) => {
    return getDocuments<Driver>(COLLECTIONS.DRIVERS, [
      where('status', '==', status),
      queryBuilder.orderByDate('created_at')
    ])
  },

  create: async (
    data: Omit<Driver, 'id' | 'created_at' | 'updated_at'>,
    files?: {
      cnh?: File
      crlv?: File
      profilePhoto?: File
      carPhoto?: File
    }
  ) => {
    const fileUrls: Driver['fileUrls'] = {}

    // Upload dos arquivos se fornecidos
    if (files) {
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const path = `drivers/${data.cpf}/${key}_${Date.now()}`
          const url = await uploadFile(path, file)
          fileUrls[key as keyof typeof fileUrls] = url
        }
      }
    }

    return addDocument<Driver>(COLLECTIONS.DRIVERS, {
      ...data,
      fileUrls
    })
  },

  update: async (
    id: string,
    data: Partial<Omit<Driver, 'id' | 'created_at'>>,
    files?: {
      cnh?: File
      crlv?: File
      profilePhoto?: File
      carPhoto?: File
    }
  ) => {
    const currentDriver = await getDocumentById<Driver>(COLLECTIONS.DRIVERS, id)
    if (!currentDriver) {
      throw new Error('Motorista não encontrado')
    }

    const fileUrls = { ...currentDriver.fileUrls }

    // Upload dos novos arquivos se fornecidos
    if (files) {
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          // Deletar arquivo antigo se existir
          if (fileUrls[key as keyof typeof fileUrls]) {
            try {
              await deleteFile(fileUrls[key as keyof typeof fileUrls]!)
            } catch (error) {
              console.error('Erro ao deletar arquivo antigo:', error)
            }
          }

          const path = `drivers/${currentDriver.cpf}/${key}_${Date.now()}`
          const url = await uploadFile(path, file)
          fileUrls[key as keyof typeof fileUrls] = url
        }
      }
    }

    return updateDocument<Driver>(COLLECTIONS.DRIVERS, id, {
      ...data,
      fileUrls
    })
  },

  delete: async (id: string) => {
    const driver = await getDocumentById<Driver>(COLLECTIONS.DRIVERS, id)
    if (!driver) {
      throw new Error('Motorista não encontrado')
    }

    // Deletar arquivos associados
    if (driver.fileUrls) {
      for (const url of Object.values(driver.fileUrls)) {
        if (url) {
          try {
            await deleteFile(url)
          } catch (error) {
            console.error('Erro ao deletar arquivo:', error)
          }
        }
      }
    }

    return deleteDocument(COLLECTIONS.DRIVERS, id)
  },

  updateStatus: async (id: string, status: Driver['status']) => {
    return updateDocument<Driver>(COLLECTIONS.DRIVERS, id, { status })
  }
} 
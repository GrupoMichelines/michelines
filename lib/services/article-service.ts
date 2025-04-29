import { Article } from '@/types/firebase'
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

export const ArticleService = {
  getAll: async () => {
    return getDocuments<Article>(COLLECTIONS.ARTICLES)
  },

  getById: async (id: string) => {
    return getDocumentById<Article>(COLLECTIONS.ARTICLES, id)
  },

  getBySlug: async (slug: string) => {
    const articles = await getDocuments<Article>(COLLECTIONS.ARTICLES, [
      where('slug', '==', slug),
      where('publicado', '==', true)
    ])
    return articles[0] || null
  },

  getPublished: async () => {
    return getDocuments<Article>(COLLECTIONS.ARTICLES, [
      where('publicado', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getFeatured: async () => {
    return getDocuments<Article>(COLLECTIONS.ARTICLES, [
      where('destaque', '==', true),
      where('publicado', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  getByCategory: async (categoria: string) => {
    return getDocuments<Article>(COLLECTIONS.ARTICLES, [
      where('categoria', '==', categoria),
      where('publicado', '==', true),
      queryBuilder.orderByDate('created_at')
    ])
  },

  create: async (
    data: Omit<Article, 'id' | 'created_at' | 'updated_at'>,
    imageFile?: File
  ) => {
    let imagem_url = data.imagem_url

    if (imageFile) {
      const path = `articles/${data.slug}/${Date.now()}`
      imagem_url = await uploadFile(path, imageFile)
    }

    return addDocument<Article>(COLLECTIONS.ARTICLES, {
      ...data,
      imagem_url
    })
  },

  update: async (
    id: string,
    data: Partial<Omit<Article, 'id' | 'created_at'>>,
    imageFile?: File
  ) => {
    const currentArticle = await getDocumentById<Article>(COLLECTIONS.ARTICLES, id)
    if (!currentArticle) {
      throw new Error('Artigo não encontrado')
    }

    let imagem_url = data.imagem_url || currentArticle.imagem_url

    if (imageFile) {
      // Deletar imagem antiga se existir e for diferente da padrão
      if (currentArticle.imagem_url && !currentArticle.imagem_url.includes('placeholder')) {
        try {
          await deleteFile(currentArticle.imagem_url)
        } catch (error) {
          console.error('Erro ao deletar imagem antiga:', error)
        }
      }

      const path = `articles/${currentArticle.slug}/${Date.now()}`
      imagem_url = await uploadFile(path, imageFile)
    }

    return updateDocument<Article>(COLLECTIONS.ARTICLES, id, {
      ...data,
      imagem_url
    })
  },

  delete: async (id: string) => {
    const article = await getDocumentById<Article>(COLLECTIONS.ARTICLES, id)
    if (!article) {
      throw new Error('Artigo não encontrado')
    }

    // Deletar imagem se existir e não for a padrão
    if (article.imagem_url && !article.imagem_url.includes('placeholder')) {
      try {
        await deleteFile(article.imagem_url)
      } catch (error) {
        console.error('Erro ao deletar imagem:', error)
      }
    }

    return deleteDocument(COLLECTIONS.ARTICLES, id)
  },

  togglePublished: async (id: string, publicado: boolean) => {
    return updateDocument<Article>(COLLECTIONS.ARTICLES, id, { publicado })
  },

  toggleFeatured: async (id: string, destaque: boolean) => {
    return updateDocument<Article>(COLLECTIONS.ARTICLES, id, { destaque })
  }
} 
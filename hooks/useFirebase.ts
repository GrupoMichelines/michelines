import { useState, useCallback } from 'react'
import { FirebaseError } from '@/lib/firebase-service'

interface UseFirebaseOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useFirebase<T>(options: UseFirebaseOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async <R>(
    operation: () => Promise<R>
  ): Promise<R | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await operation()
      setData(result as T)
      options.onSuccess?.()
      return result
    } catch (err) {
      const error = err instanceof FirebaseError
        ? err
        : new Error('Ocorreu um erro inesperado')
      setError(error)
      options.onError?.(error)
      return null
    } finally {
      setLoading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}

// Hook específico para formulários
export function useFirebaseForm<T>(options: UseFirebaseOptions = {}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = useCallback(async (
    operation: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setSubmitting(true)
      setError(null)
      const result = await operation()
      options.onSuccess?.()
      return result
    } catch (err) {
      const error = err instanceof FirebaseError
        ? err
        : new Error('Ocorreu um erro ao enviar o formulário')
      setError(error)
      options.onError?.(error)
      return null
    } finally {
      setSubmitting(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setSubmitting(false)
    setError(null)
  }, [])

  return {
    submitting,
    error,
    handleSubmit,
    reset
  }
} 
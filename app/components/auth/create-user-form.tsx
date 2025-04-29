"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FormFeedback } from "../ui/form-feedback"
import { Loader2 } from "lucide-react"

interface CreateUserFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function CreateUserForm({ onSuccess, onError }: CreateUserFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    try {
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos")
      }

      if (!/^\d+$/.test(password)) {
        throw new Error("A senha deve conter apenas números")
      }

      console.log('Criando novo usuário...')
      console.log('Email:', email)

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      console.log('Usuário criado com sucesso:', {
        email: user.email,
        uid: user.uid
      })

      await updateProfile(user, {
        displayName: name
      })

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'admin',
        createdAt: new Date().toISOString()
      })

      setSuccess(true)
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      onSuccess?.()
    } catch (err) {
      console.error('Erro ao criar usuário:', err)
      const error = err as Error
      setError(error.message)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="Nome completo"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="exemplo@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha (apenas números)</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="••••••"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="••••••"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <FormFeedback variant="error" message={error} />
        )}

        {success && (
          <FormFeedback variant="success" message="Usuário criado com sucesso!" />
        )}

        <div>
          <Button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Usuário'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../lib/firebase"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FormFeedback } from "../ui/form-feedback"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Por favor, preencha todos os campos")
      }

      console.log('Iniciando processo de login...')
      console.log('Tentando autenticar com:', { email })

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      console.log('Login bem sucedido:', {
        email: user.email,
        uid: user.uid
      })

      // Redireciona para a página admin
      router.push('/admin')
      onSuccess?.()
    } catch (error: any) {
      console.error('Erro na autenticação:', error)
      
      let errorMessage = "Erro ao fazer login. Tente novamente."
      
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Email ou senha incorretos"
          break
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde"
          break
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado"
          break
        case "auth/wrong-password":
          errorMessage = "Senha incorreta"
          break
        case "auth/user-disabled":
          errorMessage = "Esta conta foi desativada"
          break
        default:
          if (error.message) {
            errorMessage = error.message
          }
      }
      
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <FormFeedback variant="error" message={error} />
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 
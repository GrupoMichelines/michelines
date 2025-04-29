"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function CadastroSucessoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Image
            src="/images/logos/logo-grupo-michelines.png"
            alt="Logo Grupo Michelines"
            width={150}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Cadastro Recebido!</CardTitle>
            <CardDescription>
              Obrigado por se cadastrar no Grupo Michelines. Analisaremos suas informações e entraremos em contato em breve.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 Grupo Michelines. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
} 
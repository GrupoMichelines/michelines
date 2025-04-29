"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Award,
  Car,
  MapPin,
  Phone,
  Users,
  Lock,
  Calendar,
  CheckCircle,
  TrendingUp,
  Menu,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BannerCarousel from "@/app/components/banner-carousel"
import VehicleCategoryCarousel from "@/app/components/vehicle-category-carousel"
import AnimatedCounter from "@/app/components/animated-counter"
import TestimonialCarousel from "@/app/components/testimonial-carousel"
import HeroInstitucional from "@/app/components/hero-institucional"
import ComoSerTaxista from "@/app/components/como-ser-taxista"
import { RatingModal } from "@/components/rating-modal"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRatingButton, setShowRatingButton] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Mostrar o botão após 30 segundos
    const timer = setTimeout(() => {
      setShowRatingButton(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b sticky top-0 z-50 bg-white">
        <Link className="flex items-center" href="/">
          <Image
            src="/images/logos/logo-grupo-michelines.png"
            alt="Logo Grupo Micheline's"
            width={240} // Ajuste melhor para header pequeno
            height={96}
            className="h-14 w-auto object-contain rounded" // Garante altura máxima e largura automática
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#sobre">
            Sobre Nós
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#beneficios">
            Benefícios
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#veiculos">
            Veículos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#depoimentos">
            Depoimentos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contato">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cadastro" className="hidden sm:block">
            <Button>Alugue agora</Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-48 z-50">
          <nav className="flex flex-col gap-2">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#sobre">
              Sobre Nós
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#beneficios">
              Benefícios
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#veiculos">
              Veículos
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#depoimentos">
              Depoimentos
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contato">
              Contato
            </Link>
            <Link href="/cadastro">
              <Button className="w-full">Seja um Motorista</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Acesso Administrativo
              </Button>
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* Banner Carousel */}
        <section className="w-full">
          <BannerCarousel />
        </section>

        {/* Hero Institucional */}
        <HeroInstitucional />

        {/* Como Ser Taxista - Nova seção */}
        <ComoSerTaxista />

        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Locação de Táxis</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Comece uma nova fase da sua vida ao volante com o Grupo Micheline's
                </h1>
                <p className="max-w-[800px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Alugamos táxis tanto pra quem já tá na ativa quanto pra quem quer entrar de vez nessa profissão
                  respeitada e cheia de oportunidades.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center mt-4">
                  <Link href="/cadastro">
                    <Button className="px-8 bg-blue-600 hover:bg-blue-700">
                      Comece sua carreira
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#veiculos">
                    <Button variant="outline">Ver nossa frota</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas Animadas */}
        <section className="w-full py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedCounter
                end={45}
                suffix=" anos"
                title="De Tradição"
                description="Experiência e confiança no mercado de táxis"
                icon={<Calendar className="h-10 w-10" />}
              />
              <AnimatedCounter
                end={5000}
                suffix="+"
                title="Motoristas"
                description="Profissionais que realizaram seus sonhos"
                icon={<Users className="h-10 w-10" />}
              />
              <AnimatedCounter
                end={30}
                suffix="%"
                title="Mais Ganhos"
                description="Comparado aos aplicativos convencionais"
                icon={<TrendingUp className="h-10 w-10" />}
              />
              <AnimatedCounter
                end={98}
                suffix="%"
                title="Satisfação"
                description="Motoristas satisfeitos com nossos serviços"
                icon={<CheckCircle className="h-10 w-10" />}
              />
            </div>
          </div>
        </section>

        <section id="sobre" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Sobre Nós</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Orgulho de trabalhar com táxi</h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No Grupo Michelines, temos orgulho de ser parte da história do táxi, uma das profissões mais antigas e
                  queridas do mundo
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 mt-12">
              <div className="flex flex-col space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/frota85.png?height=300&width=500"
                    alt="Frota de táxis do Grupo Michelines"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold">Nossa História</h3>
                <p className="text-gray-700">
                  Com uma trajetória de mais de 45 anos no setor de locação de táxis, o Grupo Michelines tem como missão
                  simplificar o dia a dia do taxista, valorizando cada profissional que escolheu essa nobre profissão.
                </p>

              </div>
              <div className="flex flex-col space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="/missao.png?height=300&width=500"
                    alt="Motorista recebendo as chaves do táxi"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold">Nossa Missão</h3>
                <p className="text-gray-700">
                  Ser a melhor frota de táxis de São Paulo, oferecendo total suporte para que você, taxista, exerça sua profissão com excelência.
                </p>

              </div>
            </div>
            <div className="mt-12 bg-blue-50 rounded-xl p-8 shadow-md">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Award className="h-16 w-16 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Compromisso com a Excelência</h3>
                  <p className="text-gray-700">
                    Temos orgulho de ser taxistas e de contribuir para a mobilidade urbana com profissionalismo e
                    dedicação. Nossa frota é constantemente renovada e mantida nos mais altos padrões de qualidade e
                    segurança, garantindo conforto tanto para os motoristas quanto para os passageiros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="veiculos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Frota</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Veículos Disponíveis por Categoria</h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conheça nossa frota moderna e diversificada para iniciar sua carreira como taxista
                </p>
              </div>
            </div>

            <div className="mt-12">
              <VehicleCategoryCarousel />
            </div>

            <div className="mt-12 bg-blue-50 rounded-xl p-8 shadow-md">
              <div className="grid md:grid-cols-1 gap-8">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Car className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold">Parceria com D-Táxi</h4>
                      <p className="text-gray-700">
                        Acesso ao Aeroporto de Congonhas através de um sistema integrado de corridas, aumentando seus
                        ganhos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="depoimentos" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Depoimentos</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">O que dizem nossos motoristas</h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Histórias reais de quem realizou o sonho de ser taxista com o Grupo Michelines
                </p>
              </div>
            </div>

            <TestimonialCarousel />
          </div>
        </section>

        <section id="contato" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Contato</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pronto para começar?</h2>
                <p className="max-w-[600px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tire suas dúvidas ou inicie seu cadastro agora mesmo. Nossa equipe está pronta para te atender e
                  ajudar a realizar seu sonho de ser taxista.
                </p>
                <div className="space-y-4 bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">Endereço da Frota:</p>
                      <p className="text-gray-700">Rua Contos Gauchescos, 165</p>
                      <p className="text-gray-700">Vila Santa Catarina, São Paulo - SP</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">Telefone/WhatsApp:</p>
                      <p className="text-gray-700">+55 11 94483-0851</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-700">✉️</span>
                    </div>
                    <p className="font-medium">contato@michelines.com.br</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/cadastro">
                    <Button className="px-8 bg-blue-600 hover:bg-blue-700">
                      Cadastre-se agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="https://wa.me/5511944830851">
                    <Button variant="outline">Fale pelo WhatsApp</Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.6810458648433!2d-46.66987922394413!3d-23.651590978738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5a83eb7f0bf7%3A0x16feff787532245b!2sT%C3%A1xi%20Michelines%20%7C%20Alugue%20um%20T%C3%A1xi%20%7C%20Fa%C3%A7a%20sua%20Renda%20%7C%20S%C3%A3o%20Paulo%20%7C%20Frota%20de%20T%C3%A1xi!5e0!3m2!1spt-BR!2sbr!4v1745294198691!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl w-full"
                  ></iframe>
                </div>
                <form className="grid gap-4 bg-white p-6 rounded-xl shadow-md">
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="name"
                    >
                      Nome
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="name"
                      placeholder="Digite seu nome"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="email"
                      placeholder="Digite seu email"
                      type="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="phone"
                    >
                      Telefone
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="phone"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="message"
                    >
                      Mensagem
                    </label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="message"
                      placeholder="Como podemos ajudar na sua carreira de taxista?"
                    />
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Enviar mensagem
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/images/logos/logo-grupo-michelines.png"
                  alt="Logo Grupo Michelines"
                  width={280}
                  height={160}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Especialistas em locação de táxis para motoristas que desejam construir uma carreira sólida nesta nobre profissão.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <div className="space-y-2">
                <p className="text-gray-400">Rua Contos Gauchescos, 165</p>
                <p className="text-gray-400">Vila Santa Catarina, São Paulo - SP</p>
                <p className="text-gray-400">+55 11 94483-0851</p>
                <p className="text-gray-400">michelines@michelines.com.br</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#sobre" className="text-gray-400 hover:text-white transition-colors">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#beneficios" className="text-gray-400 hover:text-white transition-colors">
                    Benefícios
                  </Link>
                </li>
                <li>
                  <Link href="#veiculos" className="text-gray-400 hover:text-white transition-colors">
                    Veículos
                  </Link>
                </li>
                <li>
                  <Link href="#depoimentos" className="text-gray-400 hover:text-white transition-colors">
                    Depoimentos
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="text-gray-400 hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Grupo Micheline's. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Botão flutuante de avaliação */}
      {showRatingButton && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-4 right-4 bg-yellow-400 text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors z-50 flex items-center gap-2"
        >
          <Star className="w-5 h-5" />
          <span className="hidden sm:inline">Avaliar</span>
        </button>
      )}

      {/* Modal de avaliação */}
      <RatingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Dados dos banners
const banners = [
  {
    id: 1,
    title: "45 Anos de Tradição",
    description: "Quase cinquenta anos de experiência e parceria com você, taxista.",
    image: "/images/logos/logo-grupo-michelines.png",
    buttonText: "Conheça nossa história",
    buttonLink: "#sobre",
    color: "from-blue-900 to-blue-700",
    isLogo: true,
  },
  {
    id: 2,
    title: "Parceria com DTáxi",
    description: "Acesso exclusivo ao Aeroporto de Congonhas para nossos motoristas.",
    image: "/images/banners/dtaxi-partnership.png",
    buttonText: "Saiba mais",
    buttonLink: "#veiculos",
    color: "from-green-700 to-green-500",
    isFullImage: true,
  },
  {
    id: 3,
    title: "Novos Veículos Disponíveis",
    description: "Frota renovada com os melhores modelos para você iniciar sua carreira.",
    image: "/images/banners/novo-polo-2025.jpeg",
    buttonText: "Ver veículos",
    buttonLink: "#veiculos",
    color: "from-blue-700 to-blue-500",
    isFullImage: true,
  },
  {
    id: 4,
    title: "Espaço de Conforto para Motoristas",
    description: "Ambiente exclusivo com café, TV e Wi-Fi para descanso dos taxistas durante o período de espera.",
    image: "/images/banners/espaco-motorista.png",
    buttonText: "Conheça o espaço",
    buttonLink: "#espaco",
    color: "from-yellow-600 to-yellow-400",
    isFullImage: true,
  },
]

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <div className="relative w-full">
      <Carousel
        className="w-full"
        opts={{ loop: true, align: "start" }}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] overflow-hidden rounded-lg">
                {banner.isLogo ? (
                  <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center px-4 text-center">
                    <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto">
                      <Image
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        width={400}
                        height={200}
                        className="object-contain w-full h-auto max-h-[120px] sm:max-h-[180px] md:max-h-[220px] lg:max-h-[280px]"
                        priority
                        quality={95}
                        placeholder="blur"
                        blurDataURL="/placeholder.svg"
                      />
                    </div>
                    <div className={`mt-4 sm:mt-6 lg:mt-8 w-full max-w-2xl mx-auto bg-gradient-to-r ${banner.color} px-6 py-4 sm:px-8 sm:py-6 rounded-md`}>
                      <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">{banner.title}</h2>
                      <p className="text-sm sm:text-base lg:text-lg text-white mt-2">{banner.description}</p>
                      <Link href={banner.buttonLink} className="inline-block mt-4">
                        <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                          {banner.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 z-10">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      priority={index < 2}
                      quality={95}
                      placeholder="blur"
                      blurDataURL="/placeholder.svg"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 70vw"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                    {/* Gradiente Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {/* Conteúdo */}
                    <div className="absolute bottom-6 left-6 z-20 max-w-md">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white bg-black/50 inline-block px-3 py-2 rounded">
                        {banner.title}
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-white mt-2">{banner.description}</p>
                      <Link href={banner.buttonLink} className="inline-block mt-3">
                        <Button
                          size="sm"
                          className="bg-white text-gray-900 hover:bg-gray-100 font-bold whitespace-nowrap text-sm sm:text-base"
                        >
                          {banner.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-30" />
        <CarouselNext className="right-4 z-30" />

        {/* Indicadores */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-white" : "bg-white/50"} transition-all duration-300`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

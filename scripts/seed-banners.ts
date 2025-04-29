import { createServerSupabaseClient } from "@/lib/supabase"

export async function seedBanners() {
  const supabase = createServerSupabaseClient()

  // Verificar se já existem banners
  const { data: existingBanners } = await supabase.from("hero_banners").select("id")

  if (existingBanners && existingBanners.length > 0) {
    console.log("Banners já existem no banco de dados")
    return
  }

  // Banners de exemplo
  const banners = [
    {
      titulo: "Táxi Michelines",
      subtitulo: "Locação de táxis a partir de R$150,00 por dia",
      imagem_url: "/placeholder.svg?height=600&width=1200&text=Táxi+Michelines",
      link: "/cadastro",
      texto_botao: "Solicite seu táxi",
      ativo: true,
      ordem: 1,
    },
    {
      titulo: "Toyota Corolla Híbrido",
      subtitulo: "Economia e conforto para seu dia a dia",
      imagem_url: "/placeholder.svg?height=600&width=1200&text=Toyota+Corolla+Híbrido",
      link: "/cadastro",
      texto_botao: "Reserve agora",
      ativo: true,
      ordem: 2,
    },
    {
      titulo: "Veículos com GNV",
      subtitulo: "Economia de combustível para maximizar seus ganhos",
      imagem_url: "/placeholder.svg?height=600&width=1200&text=Veículos+com+GNV",
      link: "/cadastro",
      texto_botao: "Saiba mais",
      ativo: true,
      ordem: 3,
    },
  ]

  // Inserir banners
  const { error } = await supabase.from("hero_banners").insert(banners)

  if (error) {
    console.error("Erro ao inserir banners:", error)
    return
  }

  console.log("Banners inseridos com sucesso")
}


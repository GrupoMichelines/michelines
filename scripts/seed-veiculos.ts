import { createServerSupabaseClient } from "@/lib/supabase"

export async function seedVeiculos() {
  const supabase = createServerSupabaseClient()

  // Verificar se já existem veículos
  const { count, error: countError } = await supabase.from("veiculos").select("*", { count: "exact", head: true })

  if (countError) {
    console.error("Erro ao verificar veículos existentes:", countError)
    return { success: false, error: countError.message }
  }

  // Se já existirem veículos, não fazer nada
  if (count && count > 0) {
    console.log(`Já existem ${count} veículos no banco de dados. Pulando seed.`)
    return { success: true, message: `Já existem ${count} veículos no banco de dados.` }
  }

  // Dados iniciais dos veículos
  const veiculos = [
    {
      modelo: "Onix Plus",
      marca: "Chevrolet",
      ano: "2023",
      categoria: "Sedan",
      combustivel: "Flex",
      valor_diaria: 130.0,
      valor_semanal: 780.0,
      valor_mensal: 2800.0,
      caracteristicas: [
        "Ar-condicionado",
        "Direção elétrica",
        "Vidros elétricos",
        "Travas elétricas",
        "Airbag",
        "ABS",
        "MyLink",
      ],
      imagem_url: "/placeholder.svg?height=300&width=500&text=Onix+Plus",
      disponivel: true,
      destaque: true,
    },
    {
      modelo: "Spin",
      marca: "Chevrolet",
      ano: "2023",
      categoria: "Minivan",
      combustivel: "Flex",
      valor_diaria: 150.0,
      valor_semanal: 900.0,
      valor_mensal: 3200.0,
      caracteristicas: [
        "Ar-condicionado",
        "Direção elétrica",
        "Vidros elétricos",
        "Travas elétricas",
        "Airbag",
        "ABS",
        "7 lugares",
      ],
      imagem_url: "/placeholder.svg?height=300&width=500&text=Spin",
      disponivel: true,
      destaque: false,
    },
    {
      modelo: "Spin Acessível",
      marca: "Chevrolet",
      ano: "2023",
      categoria: "Minivan",
      combustivel: "Flex",
      valor_diaria: 170.0,
      valor_semanal: 1020.0,
      valor_mensal: 3600.0,
      caracteristicas: [
        "Ar-condicionado",
        "Direção elétrica",
        "Vidros elétricos",
        "Travas elétricas",
        "Airbag",
        "ABS",
        "Adaptado para cadeirantes",
      ],
      imagem_url: "/placeholder.svg?height=300&width=500&text=Spin+Acessível",
      disponivel: true,
      destaque: true,
      acessivel: true,
    },
    {
      modelo: "Prius",
      marca: "Toyota",
      ano: "2023",
      categoria: "Sedan",
      combustivel: "Híbrido",
      valor_diaria: 180.0,
      valor_semanal: 1080.0,
      valor_mensal: 3800.0,
      caracteristicas: [
        "Ar-condicionado",
        "Direção elétrica",
        "Vidros elétricos",
        "Travas elétricas",
        "Airbag",
        "ABS",
        "Câmbio automático",
        "Economia de combustível",
      ],
      imagem_url: "/placeholder.svg?height=300&width=500&text=Prius",
      disponivel: true,
      destaque: true,
    },
    {
      modelo: "Corolla Cross",
      marca: "Toyota",
      ano: "2023",
      categoria: "SUV",
      combustivel: "Híbrido",
      valor_diaria: 200.0,
      valor_semanal: 1200.0,
      valor_mensal: 4200.0,
      caracteristicas: [
        "Ar-condicionado",
        "Direção elétrica",
        "Vidros elétricos",
        "Travas elétricas",
        "Airbag",
        "ABS",
        "Câmbio automático",
        "Multimídia",
      ],
      imagem_url: "/placeholder.svg?height=300&width=500&text=Corolla+Cross",
      disponivel: true,
      destaque: true,
    },
  ]

  // Inserir veículos
  const { error: insertError } = await supabase.from("veiculos").insert(veiculos)

  if (insertError) {
    console.error("Erro ao inserir veículos:", insertError)
    return { success: false, error: insertError.message }
  }

  console.log(`${veiculos.length} veículos inseridos com sucesso.`)
  return { success: true, message: `${veiculos.length} veículos inseridos com sucesso.` }
}


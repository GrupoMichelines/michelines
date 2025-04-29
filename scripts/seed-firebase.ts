import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Veículos de exemplo
const veiculos = [
  {
    marca: "Toyota",
    modelo: "Corolla",
    ano: "2023",
    categoria: "Sedan",
    combustivel: "Híbrido",
    valor_diaria: 180,
    valor_semanal: 1080,
    valor_mensal: 4500,
    caracteristicas: [
      "Ar condicionado",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Airbag",
      "Freios ABS",
      "Câmbio automático",
      "Bluetooth",
      "GNV",
    ],
    imagem_url: "/placeholder.svg?height=400&width=600&text=Toyota+Corolla",
    disponivel: true,
    destaque: true,
    acessivel: false,
  },
  {
    marca: "Volkswagen",
    modelo: "Voyage",
    ano: "2022",
    categoria: "Sedan",
    combustivel: "Flex + GNV",
    valor_diaria: 150,
    valor_semanal: 900,
    valor_mensal: 3750,
    caracteristicas: [
      "Ar condicionado",
      "Direção hidráulica",
      "Vidros elétricos",
      "Travas elétricas",
      "Airbag",
      "Freios ABS",
      "GNV",
    ],
    imagem_url: "/placeholder.svg?height=400&width=600&text=Volkswagen+Voyage",
    disponivel: true,
    destaque: true,
    acessivel: false,
  },
  {
    marca: "Chevrolet",
    modelo: "Spin",
    ano: "2022",
    categoria: "Minivan",
    combustivel: "Flex + GNV",
    valor_diaria: 170,
    valor_semanal: 1020,
    valor_mensal: 4250,
    caracteristicas: [
      "7 lugares",
      "Ar condicionado",
      "Direção hidráulica",
      "Vidros elétricos",
      "Travas elétricas",
      "Airbag",
      "Freios ABS",
      "GNV",
    ],
    imagem_url: "/placeholder.svg?height=400&width=600&text=Chevrolet+Spin",
    disponivel: true,
    destaque: false,
    acessivel: true,
  },
]

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

// Artigos de exemplo
const artigos = [
  {
    titulo: "Como economizar combustível dirigindo táxi",
    slug: "como-economizar-combustivel-dirigindo-taxi",
    resumo: "Dicas práticas para economizar combustível e aumentar seus ganhos como taxista.",
    conteudo: `
# Como economizar combustível dirigindo táxi

A economia de combustível é essencial para maximizar seus ganhos como taxista. Neste artigo, compartilhamos algumas dicas práticas que podem ajudar você a reduzir o consumo de combustível e aumentar sua lucratividade.

## Mantenha seu veículo em boas condições

Um veículo bem mantido consome menos combustível. Certifique-se de:

- Trocar o óleo regularmente
- Manter os pneus calibrados corretamente
- Verificar os filtros de ar
- Realizar as manutenções preventivas

## Adote uma condução econômica

Sua forma de dirigir impacta diretamente no consumo:

- Evite acelerações bruscas
- Mantenha velocidade constante
- Use o freio motor quando possível
- Desligue o motor em paradas longas

## Planeje suas rotas

Um bom planejamento pode economizar quilômetros rodados:

- Utilize aplicativos de navegação para evitar congestionamentos
- Conheça bem a cidade para escolher caminhos mais curtos
- Evite áreas com muitos semáforos quando possível

## Considere combustíveis alternativos

- GNV (Gás Natural Veicular) pode reduzir seus custos em até 50%
- Veículos híbridos são excelentes para uso urbano
- Etanol pode ser vantajoso em algumas regiões do país

Implementando essas dicas, você poderá ver uma redução significativa nos seus gastos com combustível, aumentando sua margem de lucro no final do mês.
    `,
    imagem_url: "/placeholder.svg?height=400&width=800&text=Economia+de+Combustível",
    autor: "Equipe Táxi Michelines",
    categoria: "Dicas",
    tags: ["economia", "combustível", "dicas", "gnv"],
    tempo_leitura: "5 minutos",
    publicado: true,
    destaque: true,
  },
  {
    titulo: "Vantagens de alugar um táxi ao invés de comprar",
    slug: "vantagens-de-alugar-um-taxi-ao-inves-de-comprar",
    resumo: "Conheça as vantagens financeiras e práticas de alugar um táxi em vez de investir na compra de um veículo.",
    conteudo: `
# Vantagens de alugar um táxi ao invés de comprar

Muitos motoristas enfrentam a dúvida: é melhor comprar ou alugar um táxi? Neste artigo, analisamos as vantagens de optar pela locação.

## Menor investimento inicial

Ao alugar um táxi, você evita:

- O alto investimento na compra do veículo
- Gastos com documentação e transferência
- Despesas com adaptações para táxi
- Desvalorização imediata do bem

## Manutenção simplificada

A locação geralmente inclui:

- Manutenções preventivas
- Suporte em caso de problemas mecânicos
- Substituição do veículo em caso de pane

## Renovação da frota

Com a locação, você pode:

- Trocar de veículo periodicamente
- Sempre trabalhar com carros novos
- Oferecer mais conforto aos passageiros

## Previsibilidade financeira

O aluguel proporciona:

- Valor fixo mensal para planejamento
- Sem surpresas com gastos inesperados
- Facilidade na gestão financeira

Para muitos taxistas, especialmente iniciantes, a locação representa uma entrada mais acessível no mercado e uma forma mais segura de testar a viabilidade da profissão antes de fazer um grande investimento.
    `,
    imagem_url: "/placeholder.svg?height=400&width=800&text=Aluguel+vs+Compra",
    autor: "Equipe Táxi Michelines",
    categoria: "Finanças",
    tags: ["aluguel", "investimento", "finanças", "iniciantes"],
    tempo_leitura: "7 minutos",
    publicado: true,
    destaque: true,
  },
]

// Função para popular o Firebase
export async function seedFirebase() {
  try {
    // Adicionar veículos
    for (const veiculo of veiculos) {
      await addDoc(collection(db, "veiculos"), {
        ...veiculo,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
    }
    console.log(`${veiculos.length} veículos adicionados com sucesso!`)

    // Adicionar banners
    for (const banner of banners) {
      await addDoc(collection(db, "hero_banners"), {
        ...banner,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
    }
    console.log(`${banners.length} banners adicionados com sucesso!`)

    // Adicionar artigos
    for (const artigo of artigos) {
      await addDoc(collection(db, "artigos"), {
        ...artigo,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
    }
    console.log(`${artigos.length} artigos adicionados com sucesso!`)

    return {
      success: true,
      message: "Dados iniciais adicionados com sucesso ao Firebase!",
      counts: {
        veiculos: veiculos.length,
        banners: banners.length,
        artigos: artigos.length,
      },
    }
  } catch (error: any) {
    console.error("Erro ao popular o Firebase:", error)
    return {
      success: false,
      message: `Erro ao popular o Firebase: ${error.message}`,
      error,
    }
  }
}


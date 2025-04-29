import {
  getVeiculos,
  getVeiculo,
  getArtigos,
  getArtigoBySlug,
  getHeroBanners as getHeroBannersFromFirebase,
  addDocument,
  updateDocument,
  deleteDocument,
} from "./firebase-utils"
import type { Veiculo, Artigo, HeroBanner } from "./firebase"

// Funções para veículos
export async function getAllVeiculos(): Promise<Veiculo[]> {
  return getVeiculos()
}

export async function getVeiculosDisponiveis(): Promise<Veiculo[]> {
  return getVeiculos({ disponivel: true })
}

export async function getVeiculosDestaque(): Promise<Veiculo[]> {
  return getVeiculos({ destaque: true, disponivel: true })
}

export async function getVeiculoById(id: string): Promise<Veiculo | null> {
  return getVeiculo(id)
}

export async function addVeiculo(veiculo: Omit<Veiculo, "id" | "created_at" | "updated_at">): Promise<Veiculo | null> {
  return addDocument<Veiculo>("veiculos", veiculo)
}

export async function updateVeiculo(id: string, veiculo: Partial<Veiculo>): Promise<Veiculo | null> {
  return updateDocument<Veiculo>("veiculos", id, veiculo)
}

export async function deleteVeiculo(id: string): Promise<boolean> {
  return deleteDocument("veiculos", id)
}

// Funções para artigos
export async function getAllArtigos(): Promise<Artigo[]> {
  return getArtigos()
}

export async function getArtigosPublicados(): Promise<Artigo[]> {
  return getArtigos({ publicado: true })
}

export async function getArtigosDestaque(): Promise<Artigo[]> {
  return getArtigos({ publicado: true, destaque: true })
}

export async function getArtigoBySlugApi(slug: string): Promise<Artigo | null> {
  return getArtigoBySlug(slug)
}

// Funções para banners
export async function getHeroBanners(onlyActive = true): Promise<HeroBanner[]> {
  return getHeroBannersFromFirebase(onlyActive)
}


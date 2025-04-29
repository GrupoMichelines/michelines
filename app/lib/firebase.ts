import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export async function createEvaluation(data: {
  name: string
  email: string
  rating: number
  comment: string
  status: string
  createdAt: string
}) {
  try {
    console.log("Iniciando criação de avaliação:", data)
    const evaluationsRef = collection(db, "evaluations")
    console.log("Referência da coleção criada")
    
    const docRef = await addDoc(evaluationsRef, data)
    console.log("Avaliação criada com ID:", docRef.id)
    
    return docRef.id
  } catch (error) {
    console.error("Erro detalhado ao criar avaliação:", error)
    throw error
  }
} 
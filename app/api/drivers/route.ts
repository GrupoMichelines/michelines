import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, cpf, licenseNumber, vehicleInfo } = body

    // Adiciona o motorista ao Firestore
    const docRef = await addDoc(collection(db, 'drivers'), {
      name,
      phone,
      email,
      cpf,
      licenseNumber,
      vehicleInfo,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Motorista cadastrado com sucesso!',
      id: docRef.id 
    })
  } catch (error) {
    console.error('Erro ao cadastrar motorista:', error)
    return NextResponse.json(
      { error: 'Erro ao cadastrar motorista' },
      { status: 500 }
    )
  }
} 
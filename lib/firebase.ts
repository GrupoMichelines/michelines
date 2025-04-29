import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase initialized successfully');
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };

// Funções de autenticação
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Funções do Firestore
export const getCadastros = async () => {
  try {
    const q = query(collection(db, 'cadastros'), orderBy('dataCadastro', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataCadastro: doc.data().dataCadastro.toDate(),
    }));
  } catch (error) {
    throw error;
  }
};

export const updateCadastroStatus = async (id: string, status: string) => {
  try {
    const docRef = doc(db, 'cadastros', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    throw error;
  }
};

export const addCadastro = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'cadastros'), {
      ...data,
      dataCadastro: new Date(),
      status: 'em_analise'
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Tipos para as coleções do Firestore
export interface Veiculo {
  id: string
  modelo: string
  marca: string
  ano: string
  categoria: string
  combustivel: string
  valor_diaria: number
  valor_semanal: number
  valor_mensal: number
  caracteristicas: string[]
  imagem_url: string
  disponivel: boolean
  destaque: boolean
  acessivel: boolean
  created_at: string
  updated_at: string
}

export interface Avaliacao {
  id: string
  nome: string
  email: string
  texto: string
  nota: number
  status: "pendente" | "aprovado" | "reprovado"
  created_at: string
  updated_at: string
}

export interface HeroBanner {
  id: string
  titulo: string
  subtitulo: string
  imagem_url: string
  link: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Artigo {
  id: string
  titulo: string
  slug: string
  conteudo: string
  resumo: string
  imagem_url: string
  autor: string
  categoria: string
  tags: string[]
  publicado: boolean
  destaque: boolean
  created_at: string
  updated_at: string
}

// Coleções do Firestore
export const collections = {
  drivers: "drivers",
  vehicles: "vehicles",
  rentals: "rentals",
  users: "users",
  documents: "documents",
  evaluations: "evaluations",
  rentalRequests: "rentalRequests"
} as const


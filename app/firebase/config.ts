// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGoe-hQNhMzBDQj1xoO38vHQobZa6oh6I",
  authDomain: "grupo-michelines.firebaseapp.com",
  projectId: "grupo-michelines",
  storageBucket: "grupo-michelines.firebasestorage.app",
  messagingSenderId: "1045846661230",
  appId: "1:1045846661230:web:2f3518786082a382362e7f",
  measurementId: "G-L0L4HTH44B"
}

// Initialize Firebase
let app
try {
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
    console.log("Firebase inicializado com sucesso")
} else {
    app = getApps()[0]
    console.log("Usando instância existente do Firebase")
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error)
  throw new Error("Falha ao inicializar o Firebase")
}

if (!app) {
  throw new Error("Falha ao inicializar o Firebase: app é undefined")
}

// Inicializar serviços do Firebase
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const database = getDatabase(app)

// Initialize Analytics only on client side
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { auth, db, storage, database, analytics }

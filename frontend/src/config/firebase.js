import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias para usar no app
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);

// Configuração dos Emuladores para Ambiente de Desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log("🔥 PedeAê tentando conectar aos Emuladores Locais...");

  // Usar 'localhost' é mais estável para comunicação via navegador (Web)
  connectFirestoreEmulator(db, 'localhost', 8080);

  // O emulador de Functions
  connectFunctionsEmulator(functions, 'localhost', 5001);

  // O emulador de Autenticação (Login)
  connectAuthEmulator(auth, "http://localhost:9099");
}
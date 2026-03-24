import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqeLJ_7KEKszVJrs4Q29ZJCdGyVgS1xpk",
  authDomain: "pedeae-a50ce.firebaseapp.com",
  projectId: "pedeae-a50ce",
  storageBucket: "pedeae-a50ce.firebasestorage.app",
  messagingSenderId: "1005982730734",
  appId: "1:1005982730734:web:39be81d462253487f766ff"
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
// Importa a função base para inicializar um aplicativo Firebase
import { initializeApp } from "firebase/app";
// Importa o banco de dados Firestore e a função para conectar ao emulador local do Firestore
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// Importa o serviço de armazenamento (Storage) do Firebase
import { getStorage } from "firebase/storage";
// Importa o serviço de funções (Functions) do Cloud e a função para conectar ao emulador
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// Importa o serviço de Autenticação e a função para conectar ao emulador de Auth
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Cria o objeto de configuração do Firebase com as chaves do ambiente (arquivo .env)
const firebaseConfig = {
  // Chave da API usada para identificar o projeto no Firebase
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  // Domínio padrão para serviço de autenticação
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ID exclusivo do projeto no Google Cloud/Firebase
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // URL do bucket (espaço) onde os arquivos de storage serão salvos
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // ID do remetente para receber notificações via mensageria (Cloud Messaging)
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // ID único do aplicativo registrado dentro do projeto Firebase
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializa a instância principal do Firebase usando as configurações fornecidas
const app = initializeApp(firebaseConfig);

// Inicializa o serviço do Firestore (Banco de Dados) amarrado ao nosso app e o exporta
export const db = getFirestore(app);
// Inicializa o serviço de Armazenamento (Imagens, etc) amarrado ao nosso app e o exporta
export const storage = getStorage(app);
// Inicializa o serviço de Cloud Functions amarrado ao nosso app e o exporta
export const functions = getFunctions(app);
// Inicializa o serviço de Autenticação de usuários amarrado ao app e o exporta
export const auth = getAuth(app);

// Verifica se o ambiente de execução atual é "development" (modo de desenvolvimento local)
// -----------------------------------------------------------------------------
// BLOCO COMENTADO PARA A APRESENTAÇÃO: 
// O app agora conectará diretamente ao Firebase na nuvem, permitindo que a Vercel 
// e os usuários finais acessem os dados reais.
// -----------------------------------------------------------------------------
/*
if (process.env.NODE_ENV === 'development') {
  // Imprime um aviso no console indicando que tentará conectar aos emuladores
  console.log("🔥 PedeAê tentando conectar aos Emuladores Locais...");

  // Conecta nossa instância do Firestore ('db') ao emulador local rodando na porta 8080
  // Usar 'localhost' é mais estável para comunicação via navegador (Web)
  connectFirestoreEmulator(db, 'localhost', 8080);

  // Conecta nossa instância de Functions ao emulador local rodando na porta 5001
  connectFunctionsEmulator(functions, 'localhost', 5001);

  // Conecta nossa instância de Autenticação ao emulador local rodando na porta 9099
  connectAuthEmulator(auth, "http://localhost:9099");
}
*/
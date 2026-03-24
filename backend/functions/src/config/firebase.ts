// Importa Biblioteca Firebase Admin SDK que dá privilégios Master absolutos no Banco para o servidor NodeJS Backend API Cloud Functions Node Server.
import * as admin from 'firebase-admin';

// Initialize the Firebase admin app
// Descobre/Carrega automaticamente O Cofre de Senhas Credenciais Secretas Contas Projetos Google Cloud Environments (.env / GCloud json Secrets) Servidores padrão V8 Google VMs Docker 
// Evita Dupla Inicializações Globais checando o Tamanho da Array de Apps Ligados Boolean If Validation
if (!admin.apps.length) {
    admin.initializeApp(); // Inicia Conexao Com DB. Cloud DB Boot
}

// Exporta Variaveis de Acesso Direto para Facilitar uso em outros Arquivos sem ter que Chamar 'admin.x()' Toda Hora
export const db = admin.firestore(); // Conexao Com Banco de Dados NoSQL Módulos Firestore
export const auth = admin.auth(); // Conexao Gestão de Usuários e Tokens Modulo Auth
export const messaging = admin.messaging(); // Conexao Servidor Mensagens/Notificações Push App Modulo Cloud Messaging FCM Notifications Push Engine Messaging Modulo

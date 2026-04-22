"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreated = void 0;
// API Principal do Firebase Cloud Functions (Permite escutar eventos na Nuvem) Backend Serverless
const functions = __importStar(require("firebase-functions"));
// Admin SDK de privilégio máximo do Firebase (Bypass nas regras de segurança do Firestore database Rules) Root Access Database
const admin = __importStar(require("firebase-admin"));
// Nossa Instância Global (Central de config) Exportada com Acesso ao Auth (Contas) e DB (Node/Collections Firestore)
const firebase_1 = require("../config/firebase");
// Exporta Função Assincrona Cloud. Event Listener Autônomo na nuvem (.onCreate) que Dispara Sozinho toda vez que uma conta/usuário novo termina de se registrar no sistema pelo APP. Node.js backend logic
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    // Desestrutura o objeto gigante "user" para pegar apenas o E-mail de cadastro e o ID Único (UID Firebase hash auth ID Token)
    const { email, uid } = user;
    // Regra Lógica de Negócios Backend: Apenas o usuário com email Exato "admin@pedeae.com.br" ganha poderes administrativos.
    // Variável Local Definitiva de Níveis de Acesso Padrão: Usuários comuns novos são "CLIENTE" por padrão (Fail-Safe security Role based architecture)
    let role = 'CLIENTE';
    // Condicional Master de Concedimento de Perfil Hierárquico: Se for o Dono App. Mude a str da Váriavel
    if (email === 'admin@pedeae.com.br') {
        role = 'ADMIN';
    }
    // Try/Catch: Tratativa de erros de rede ou promessas para não crashar ou "travar" a função no meio. Error Handling Block Promises
    try {
        // Passo Mágico Admin: Injeta "Custom Claims" (Marcas/Carimbos ocultos de JWT Token). Isso viaja no token invisivel do cliente para o Front End Frontend Router Checar dps se o cara é ADM ou não nas views. (Token Metadata Injection)
        // Armazenar a role na Custom Claim do token
        await firebase_1.auth.setCustomUserClaims(uid, { role });
        // Espelhamento NoSql: Além Ciar Usuário no módulo "Auth", cria um espelho visível dele na Collection Tabela "users" no Banco Firestore NoSQL Table Documents Collections Root Structure 
        // Armazenar informações no Firestore
        await firebase_1.db.collection('users').doc(uid).set({
            id: uid, // Id Primary Key Copiada Idêntica App Authentication Token Id
            email: email || '', // Previne Nulls c Falbacks
            role: role, // Salva o Nivel de acesso na Tabela Visível tbm Client DB Reading
            fcmTokens: [], // Array Pronta em Branco esperando receber Tolens Push Notification de Celular Celullar Notification Tokens Firebase Cloud Messaging
            createdAt: admin.firestore.FieldValue.serverTimestamp() // Pede ao Relório Atômico Preciso Oficial do Servidor Master do Google pra Inserir Hora Criada Oficial Universal DB Timestamp
        });
        // Console Log Profissional da Google Cloud System Logs (Monitoramento Observability Google Cloud Plataform Logging Monitor View Terminal Functions Dashboard Logger )
        functions.logger.info(`Usuário ${uid} criado e classificado como ${role}.`);
    }
    catch (error) {
        // Envia "Erro Vermelho Fatal" Pro sistema de Logs Cloud Watch Crashlitys do Projeto Painel Google 
        functions.logger.error('Erro ao definir role ou criar doc do usuáro:', error);
    }
});
//# sourceMappingURL=onUserCreated.js.map
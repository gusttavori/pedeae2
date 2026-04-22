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
exports.messaging = exports.auth = exports.db = void 0;
// Importa Biblioteca Firebase Admin SDK que dá privilégios Master absolutos no Banco para o servidor NodeJS Backend API Cloud Functions Node Server.
const admin = __importStar(require("firebase-admin"));
// Initialize the Firebase admin app
// Descobre/Carrega automaticamente O Cofre de Senhas Credenciais Secretas Contas Projetos Google Cloud Environments (.env / GCloud json Secrets) Servidores padrão V8 Google VMs Docker 
// Evita Dupla Inicializações Globais checando o Tamanho da Array de Apps Ligados Boolean If Validation
if (!admin.apps.length) {
    admin.initializeApp(); // Inicia Conexao Com DB. Cloud DB Boot
}
// Exporta Variaveis de Acesso Direto para Facilitar uso em outros Arquivos sem ter que Chamar 'admin.x()' Toda Hora
exports.db = admin.firestore(); // Conexao Com Banco de Dados NoSQL Módulos Firestore
exports.auth = admin.auth(); // Conexao Gestão de Usuários e Tokens Modulo Auth
exports.messaging = admin.messaging(); // Conexao Servidor Mensagens/Notificações Push App Modulo Cloud Messaging FCM Notifications Push Engine Messaging Modulo
//# sourceMappingURL=firebase.js.map
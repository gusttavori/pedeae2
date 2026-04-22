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
exports.assertAuthenticated = exports.assertAdmin = void 0;
// Base lib de Respostas de Erros e Codigos Http 401 403 500 do Própio Firebase Router Http Request Node Express Pattern Errors Core SDK API Errors API Builder Callables Cloud Context Server Wrapper
const functions = __importStar(require("firebase-functions"));
/**
 * Utilitário/Função GuardaCosta (Interceptador Middleware) para barrar Acessos HTTP Directos as Functions Pelo Celular APIs
 * Utilitário para ser utilizado em funções Callable (onCall)
 * que valida se o usuário que invocou a função é ADMIN.
 */
// Recebe a Request Contendo Cabecalhos JWT Token Payload (Context Parameter Server Request Client Client Token Payloads Request Server Function Method Props)
const assertAdmin = (context) => {
    // Tenta Ler o Token Envioado e Falha o Sistema Atirando um Erro (Throw Error Fatal Stop Execution Engine Function Throw) Caso Seja Guest Nulo Visitors
    if (!context.auth) {
        throw new functions.https.HttpsError(// Erro Google Especial pra App Capturar Clean e Bonito Native Error
        'unauthenticated', // Code Identifier
        'O usuário deve estar autenticado.' // Msg String User Human Readable Error Messages Exceptions Throw String Error Codes Exception String HTTP Payload Exception Error
        );
    }
    // A Role Custom Claim (Aquele Role injetado escondido na hora do Login Create) é Descriptografada pelo Servidor Master E Lida aqui Secure Validate Checks Hacking Checks JWT Claim Token Checks Secure Read Checks
    // Se o Carimbo Digital Nao FOr Exatamente "ADMIN" Bate de Frente e Trava Cospindo Status 403 Access Denied Web HTTP Pattern Throw
    // A Role Custom Claim é acessível no objeto de auth de funções Callable
    if (context.auth.token.role !== 'ADMIN') {
        throw new functions.https.HttpsError('permission-denied', 'O acesso a esta função requer privilégios de Administrador.');
    }
};
exports.assertAdmin = assertAdmin;
/**
 * Segundo GuardCosta Mas "Menos Rigoroso". So Valida se é um "Cliente Logado Comum Validado sem Anonymous" .
 * Utilitário para validar autorização mínima (ser cliente/usuário autenticado).
 */
const assertAuthenticated = (context) => {
    // Joga erro se Não Tiver Header JWT Token Auth Configurados Exigidos Tokens Auth Bearers Payload JWT Token Validator Checks Auth context validations Token Context Verification Auth Tokens
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'O usuário deve estar autenticado.');
    }
};
exports.assertAuthenticated = assertAuthenticated;
//# sourceMappingURL=authMiddleware.js.map
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
exports.createPayment = void 0;
// Pacote Base Construtor de Endpoints APIs SDK Google Firebase Triggers API Callables Node API Wrapper Method Functions Core Native Server Library Configs Native Env Method Engine Base Cloud API
const functions = __importStar(require("firebase-functions"));
// Chamada de Camada de Segurança Reutível (Evita que Hakers batam a porta desse Metodo Sem tar C Conta/Token validos) Middlewares Protection Gatekeeper
const authMiddleware_1 = require("../middlewares/authMiddleware");
// Lib Core Instancia Firebase Master pra ler banco Db Driver Methods Select Find Access Config Access Object
const firebase_1 = require("../config/firebase");
/**
 * Endpoint Exposto Tipo "onCall" (Que ja desencrypta e Injeta os Dados Do Celular Auth do Usiario Automatico). Callable Node API Http Endpoints HTTP Server Triggers Express App Routing Serverless
 * Callable endpoint para gerar a intenção de pagamento / código Pix.
 */
exports.createPayment = functions.https.onCall(async (data, context) => {
    // Escudo Protetor (Larga um Codigo 403 / 500 Nulo pro Client) App se Ele For Anonimo Middlewares Auth Verify
    // Apenas clientes logados
    (0, authMiddleware_1.assertAuthenticated)(context);
    // Corpo D Payload Do App Celular Request HTTP Body Params Payload API Dto Dto Payload Payload Req Params  
    const { orderId } = data;
    // Missing Id Defenses (Obriga q Mandem as Variavies validas Senao Crasha proposital API Errors Exception Native FireBase Core API Exception Https Error Response Models 400 Bad Requests) Validation Model Request Check Parameters Exception 
    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'O id do pedido é obrigatório.');
    }
    // Puxa Do Banco a Referencia Fisica do DB Query API Promisses Calls Gets Docs Target Get Order Database Query 
    const orderSnap = await firebase_1.db.collection('orders').doc(orderId).get();
    // Previne Bater em ID Falso / Vazio e Quebrar App Com Undefineds Null Pointers Not Foud Checks If False Errors Exceptions
    if (!orderSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Pedido não encontrado.');
    }
    // Extrai o Json Limpo Dto
    const orderData = orderSnap.data();
    // Anty-Bypass Security (Role Permissions Hack Security User Scope Auth Role Models Identity Protection Security Architect Database Rules Haking Database Cross Accounts Request API Request Validation Architectures Security Validations Token Request Validation Checks Validations Access Controls Permission Checks API Defences Access Verify Token Context Validations User Matches Identity Core Access Defences Hacking Prevention Code Security Server Pattern Architecture Checks Validations Access Context Values Auth Tokens Identifiers Controls Core Logic Validator Code Logic API Verification Rules Roles Defences Permissions Security Validate Request Verify Identity Security Validation Authorization Rules Code Server Validation Rule Access Security Methods Controls Core Checks Data Validate Request Auth Security Methods Validation Verify Defences Security Rule User Request Rules Validations Check Core Validator Verify Context Methods Validation Identifiers Rules Identity Security Server
    // O usuário que disparou deve ser o dono daquele documento
    if (orderData?.userId !== context.auth?.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Você não tem permissão para pagar o pedido de terceiros.');
    }
    // Regras de Condições Máquina Estado Status Checks Rule Prevent Double Pay Bug Prevent Fail Fast 
    if (orderData?.status !== 'pendente_pagamento') {
        throw new functions.https.HttpsError('failed-precondition', 'Este pedido não é elegível a novo pagamento ou já foi pago.');
    }
    // Simulador String Formats UUID Builders Payment Gateways. Ponto Exato Da Injeção SDK EXTERNA SDK MercerSDK PagarMe Stripe Mercadopago Integrations Lib Node.js Pix Webhook Generation PIX Copia Cola
    // Gerar mock do Pix ou Cartão - Integração com MercadoPago ou SDK similar vai aqui
    const mockPixCode = `00020101021126580014br.gov.bcb.pix0136mock-uuid-pagamento-${orderId}5204000053039865405${orderData.total}5802BR5911PedeAe Mock6009RibeiraoPreto62070503***6304ABCD`;
    // Resposta HTTP Response Node Express Dto Format Respostas JSON Return Callables
    return {
        success: true,
        method: 'pix', // O Tipo De transacao Selecionada
        qrCode: mockPixCode,
        total: orderData.total, // Conferencias De Preços DB Safe
        message: 'Código de pagamento gerado com sucesso.'
    };
});
//# sourceMappingURL=createPayment.js.map
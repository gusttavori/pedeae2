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
const functions = __importStar(require("firebase-functions"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const firebase_1 = require("../config/firebase");
/**
 * Callable endpoint para gerar a intenção de pagamento / código Pix.
 */
exports.createPayment = functions.https.onCall(async (data, context) => {
    // Apenas clientes logados
    (0, authMiddleware_1.assertAuthenticated)(context);
    const { orderId } = data;
    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'O id do pedido é obrigatório.');
    }
    const orderSnap = await firebase_1.db.collection('orders').doc(orderId).get();
    if (!orderSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Pedido não encontrado.');
    }
    const orderData = orderSnap.data();
    // O usuário que disparou deve ser o dono daquele documento
    if (orderData?.userId !== context.auth?.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Você não tem permissão para pagar o pedido de terceiros.');
    }
    if (orderData?.status !== 'pendente_pagamento') {
        throw new functions.https.HttpsError('failed-precondition', 'Este pedido não é elegível a novo pagamento ou já foi pago.');
    }
    // Gerar mock do Pix ou Cartão - Integração com MercadoPago ou SDK similar vai aqui
    const mockPixCode = `00020101021126580014br.gov.bcb.pix0136mock-uuid-pagamento-${orderId}5204000053039865405${orderData.total}5802BR5911PedeAe Mock6009RibeiraoPreto62070503***6304ABCD`;
    return {
        success: true,
        method: 'pix',
        qrCode: mockPixCode,
        total: orderData.total,
        message: 'Código de pagamento gerado com sucesso.'
    };
});
//# sourceMappingURL=createPayment.js.map
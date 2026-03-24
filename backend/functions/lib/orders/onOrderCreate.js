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
exports.onOrderCreate = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_1 = require("../config/firebase");
exports.onOrderCreate = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
    const orderData = snap.data();
    if (!orderData)
        return null;
    // Recálculo seguro contra hack no front-end: iterar por itens buscando o valor verdadeiro
    let calculatedTotal = 0;
    const validatedItems = [];
    for (const item of orderData.items || []) {
        if (!item.productId)
            continue;
        const productSnap = await firebase_1.db.collection('products').doc(item.productId).get();
        if (productSnap.exists) {
            const product = productSnap.data();
            const actualPrice = product?.price || 0;
            calculatedTotal += actualPrice * item.quantity;
            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: actualPrice // Sobrescrevendo o preço para garantir integridade
            });
        }
    }
    // Atualizar o pedido com dados confiáveis
    return snap.ref.update({
        items: validatedItems,
        total: calculatedTotal,
        status: 'pendente_pagamento',
        verifiedAt: new Date()
    });
});
//# sourceMappingURL=onOrderCreate.js.map
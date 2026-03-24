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
exports.onOrderStatusChange = void 0;
const functions = __importStar(require("firebase-functions"));
const stockService_1 = require("../services/stockService");
const notificationService_1 = require("../services/notificationService");
exports.onOrderStatusChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const orderId = context.params.orderId;
    const oldStatus = before.status;
    const newStatus = after.status;
    // Se o status não mudou, evitamos redundância
    if (oldStatus === newStatus)
        return null;
    functions.logger.info(`Pedido ${orderId} mudou de ${oldStatus} para ${newStatus}`);
    // Quando o pagamento é aprovado via webhook, o status transiciona para "novo"
    if (newStatus === 'novo' && oldStatus === 'pendente_pagamento') {
        await (0, stockService_1.updateStock)(after.items || []);
        await (0, notificationService_1.notifyStatusChange)(orderId, after.userId, 'novo');
        return null;
    }
    // Notificações orientadas ao cliente sobre preparações
    if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
        await (0, notificationService_1.notifyStatusChange)(orderId, after.userId, newStatus);
        return null;
    }
    return null;
});
//# sourceMappingURL=onOrderStatusChange.js.map
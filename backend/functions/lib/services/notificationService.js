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
exports.notifyStatusChange = void 0;
const firebase_1 = require("../config/firebase");
const functions = __importStar(require("firebase-functions"));
/**
 * Função responsável por agrupar lógica de push notification no FCM.
 */
const notifyStatusChange = async (orderId, userId, newStatus) => {
    try {
        if (newStatus === 'novo') {
            // Notificar a COZINHA
            const cozinhaUsers = await firebase_1.db.collection('users').where('role', '==', 'COZINHA').get();
            let tokens = [];
            cozinhaUsers.forEach(doc => {
                const userTokens = doc.data().fcmTokens || [];
                tokens = [...tokens, ...userTokens];
            });
            // Filtra tokens válidos e únicos
            tokens = [...new Set(tokens.filter(t => typeof t === 'string' && t.length > 0))];
            if (tokens.length > 0) {
                const message = {
                    notification: {
                        title: '✅ Novo Pedido PedeAê!',
                        body: `Um novo pedido pago chegou (#${orderId}). Veja os detalhes na fila!`
                    },
                    data: { orderId, status: newStatus, link: '/dashboard' },
                    tokens
                };
                await firebase_1.messaging.sendEachForMulticast(message);
                functions.logger.info(`Notificação de pedido ${orderId} enviada para cozinha (${tokens.length} tokens).`);
            }
        }
        else if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
            // Notificar o CLIENTE
            const userSnap = await firebase_1.db.collection('users').doc(userId).get();
            if (userSnap.exists) {
                const userTokens = userSnap.data()?.fcmTokens || [];
                const validTokens = [...new Set(userTokens.filter((t) => typeof t === 'string' && t.length > 0))];
                let title = 'Atualização do seu Pedido';
                let body = `Seu pedido está no status: ${newStatus}`;
                if (newStatus === 'preparando') {
                    title = '👨‍🍳 Pedido sendo Preparado!';
                    body = 'Sua comida já está sendo preparada e logo estará pronta.';
                }
                else if (newStatus === 'pronto') {
                    title = '🔔 Pedido Pronto!';
                    body = 'Seu pedido já pode ser retirado ou está aguardando entrega.';
                }
                else if (newStatus === 'entregue') {
                    title = '🎉 Pedido Entregue!';
                    body = 'Aproveite sua refeição! O PedeAê agradece a preferência.';
                }
                if (validTokens.length > 0) {
                    const message = {
                        notification: { title, body },
                        data: { orderId, status: newStatus },
                        tokens: validTokens
                    };
                    await firebase_1.messaging.sendEachForMulticast(message);
                    functions.logger.info(`Notificação do status ${newStatus} enviada ao cliente ${userId}.`);
                }
            }
        }
    }
    catch (error) {
        functions.logger.error(`Erro ao enviar notificação de status (${newStatus}) para o pedido ${orderId}:`, error);
    }
};
exports.notifyStatusChange = notifyStatusChange;
//# sourceMappingURL=notificationService.js.map
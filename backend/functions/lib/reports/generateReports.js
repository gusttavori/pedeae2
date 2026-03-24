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
exports.generateReports = void 0;
const functions = __importStar(require("firebase-functions"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const firebase_1 = require("../config/firebase");
/**
 * Console logístico para o papel de ADMIN focado em resumos diários ou fechamento.
 */
exports.generateReports = functions.https.onCall(async (data, context) => {
    // Interrompe e desliga a função se client não tiver claims adequadas
    (0, authMiddleware_1.assertAdmin)(context);
    // Construtores de tempo com defaults do dia atual
    const dateStart = data.startDate ? new Date(data.startDate) : new Date(new Date().setHours(0, 0, 0, 0));
    const dateEnd = data.endDate ? new Date(data.endDate) : new Date(new Date().setHours(23, 59, 59, 999));
    try {
        const ordersSnap = await firebase_1.db.collection('orders')
            .where('status', 'in', ['entregue', 'pronto']) // Contabilizar vendas consumadas
            .where('createdAt', '>=', dateStart)
            .where('createdAt', '<=', dateEnd)
            .get();
        let totalRevenue = 0;
        const productsCount = {};
        ordersSnap.forEach(doc => {
            const order = doc.data();
            totalRevenue += (order.total || 0);
            const items = order.items || [];
            items.forEach((item) => {
                if (!item.productId)
                    return;
                if (!productsCount[item.productId]) {
                    productsCount[item.productId] = 0;
                }
                productsCount[item.productId] += item.quantity;
            });
        });
        const topProducts = Object.entries(productsCount)
            .map(([productId, quantity]) => ({ productId, quantity }))
            .sort((a, b) => b.quantity - a.quantity);
        return {
            totalRevenue,
            totalOrders: ordersSnap.size,
            topProducts,
            period: {
                start: dateStart.toISOString(),
                end: dateEnd.toISOString()
            }
        };
    }
    catch (error) {
        functions.logger.error('Erro na agregação de resultados do Firestore:', error);
        throw new functions.https.HttpsError('internal', 'Ocorreu um problema ao compilar os relatórios no servidor.');
    }
});
//# sourceMappingURL=generateReports.js.map
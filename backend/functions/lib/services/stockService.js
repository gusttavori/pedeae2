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
exports.updateStock = void 0;
const firebase_1 = require("../config/firebase");
const functions = __importStar(require("firebase-functions"));
/**
 * Função responsável por abater o estoque dos produtos
 * e atualizar a disponibilidade se o estoque zerar.
 */
const updateStock = async (orderItems) => {
    const batch = firebase_1.db.batch();
    for (const item of orderItems) {
        if (!item.productId)
            continue;
        const productRef = firebase_1.db.collection('products').doc(item.productId);
        const productSnap = await productRef.get();
        if (!productSnap.exists) {
            functions.logger.warn(`Produto ${item.productId} não encontrado ao atualizar estoque.`);
            continue;
        }
        const data = productSnap.data();
        const currentStock = data?.stock || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        const available = newStock > 0 && data?.available !== false;
        batch.update(productRef, {
            stock: newStock,
            available: available
        });
    }
    // Executa e commita as alterações no firebase
    await batch.commit();
};
exports.updateStock = updateStock;
//# sourceMappingURL=stockService.js.map
import { db } from '../config/firebase';
import * as functions from 'firebase-functions';

/**
 * Função responsável por abater o estoque dos produtos
 * e atualizar a disponibilidade se o estoque zerar.
 */
export const updateStock = async (orderItems: Array<{ productId: string, quantity: number }>) => {
    const batch = db.batch();
    
    for (const item of orderItems) {
        if (!item.productId) continue;

        const productRef = db.collection('products').doc(item.productId);
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

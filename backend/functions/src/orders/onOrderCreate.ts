import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

export const onOrderCreate = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const orderData = snap.data();
        
        if (!orderData) return null;

        // Recálculo seguro contra hack no front-end: iterar por itens buscando o valor verdadeiro
        let calculatedTotal = 0;
        const validatedItems = [];

        for (const item of orderData.items || []) {
            if (!item.productId) continue;

            const productSnap = await db.collection('products').doc(item.productId).get();
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

import * as functions from 'firebase-functions';
import { assertAuthenticated } from '../middlewares/authMiddleware';
import { db } from '../config/firebase';

/**
 * Callable endpoint para gerar a intenção de pagamento / código Pix.
 */
export const createPayment = functions.https.onCall(async (data, context) => {
    // Apenas clientes logados
    assertAuthenticated(context);

    const { orderId } = data;
    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'O id do pedido é obrigatório.');
    }

    const orderSnap = await db.collection('orders').doc(orderId).get();
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

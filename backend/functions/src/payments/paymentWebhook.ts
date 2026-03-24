import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

/**
 * HTTP REST endpoint focado em recepcionar callbacks vindos do Gateway de Pagamento,
 * logo, não usaremos o utilitaritário onCall (que carrega token client-side automático).
 */
export const paymentWebhook = functions.https.onRequest(async (req, res) => {
    // Webhooks costumam ser via POST
    if (req.method !== 'POST') {
        res.status(405).send('O método fornecido não é suportado.');
        return;
    }

    const { orderId, status } = req.body;

    // Autenticação mockada contrainjeções 
    // Em um cenário real usa-se assinatura do corpo do Stripe, HMAC do Pagar.me ou tokens definidos no console
    const internalSecret = req.headers['x-webhook-token'];
    
    // Supondo que em production configuramos o secret das functions config ou variáveis de ambiente
    if (internalSecret !== 'sua-chave-secreta-webhook-pedeae-2026') {
        functions.logger.warn(`Chamada não autêntica para o pedido: ${orderId}`);
        res.status(401).send('Não autorizado.');
        return;
    }

    // Lógica para marcar pagamento na collection "orders"
    if (status === 'approved' && orderId) {
        try {
            const orderRef = db.collection('orders').doc(orderId);
            const orderSnap = await orderRef.get();
            
            if (!orderSnap.exists) {
                functions.logger.warn(`Recebemos webhook para pedido não existente: ${orderId}`);
                res.status(404).send('Pedido inlocalizável.');
                return;
            }

            const currentStatus = orderSnap.data()?.status;
            if (currentStatus === 'pendente_pagamento') {
                // Ao efetuar esta mutação no Firebase, o trigger `onOrderStatusChange`
                // é engatilhado no background magicamente!
                await orderRef.update({ 
                    status: 'novo',
                    paymentApprovedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                functions.logger.info(`Pagamento liquidado via webhook com sucesso. ID Origem: ${orderId}`);
            }

            res.status(200).send({ received: true });
        } catch (error) {
            functions.logger.error('Erro transacional na recepção do gateway:', error);
            res.status(500).send('Erro interno do servidor.');
        }
    } else {
        res.status(400).send('Payload malformado.');
    }
});

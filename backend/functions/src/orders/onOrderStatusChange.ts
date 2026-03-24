import * as functions from 'firebase-functions';
import { updateStock } from '../services/stockService';
import { notifyStatusChange } from '../services/notificationService';

export const onOrderStatusChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const orderId = context.params.orderId;

        const oldStatus = before.status;
        const newStatus = after.status;

        // Se o status não mudou, evitamos redundância
        if (oldStatus === newStatus) return null;

        functions.logger.info(`Pedido ${orderId} mudou de ${oldStatus} para ${newStatus}`);

        // Quando o pagamento é aprovado via webhook, o status transiciona para "novo"
        if (newStatus === 'novo' && oldStatus === 'pendente_pagamento') {
            await updateStock(after.items || []);
            await notifyStatusChange(orderId, after.userId, 'novo');
            return null;
        }

        // Notificações orientadas ao cliente sobre preparações
        if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
            await notifyStatusChange(orderId, after.userId, newStatus);
            return null;
        }

        return null;
    });

import { messaging, db } from '../config/firebase';
import * as functions from 'firebase-functions';

/**
 * Função responsável por agrupar lógica de push notification no FCM.
 */
export const notifyStatusChange = async (orderId: string, userId: string, newStatus: string) => {
    try {
        if (newStatus === 'novo') {
            // Notificar a COZINHA
            const cozinhaUsers = await db.collection('users').where('role', '==', 'COZINHA').get();
            let tokens: string[] = [];
            
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
                
                await messaging.sendEachForMulticast(message);
                functions.logger.info(`Notificação de pedido ${orderId} enviada para cozinha (${tokens.length} tokens).`);
            }
        } else if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
            // Notificar o CLIENTE
            const userSnap = await db.collection('users').doc(userId).get();
            
            if (userSnap.exists) {
                const userTokens = userSnap.data()?.fcmTokens || [];
                const validTokens = [...new Set(userTokens.filter((t: any) => typeof t === 'string' && t.length > 0))] as string[];
                
                let title = 'Atualização do seu Pedido';
                let body = `Seu pedido está no status: ${newStatus}`;

                if (newStatus === 'preparando') {
                    title = '👨‍🍳 Pedido sendo Preparado!';
                    body = 'Sua comida já está sendo preparada e logo estará pronta.';
                } else if (newStatus === 'pronto') {
                    title = '🔔 Pedido Pronto!';
                    body = 'Seu pedido já pode ser retirado ou está aguardando entrega.';
                } else if (newStatus === 'entregue') {
                    title = '🎉 Pedido Entregue!';
                    body = 'Aproveite sua refeição! O PedeAê agradece a preferência.';
                }

                if (validTokens.length > 0) {
                    const message = {
                        notification: { title, body },
                        data: { orderId, status: newStatus },
                        tokens: validTokens
                    };

                    await messaging.sendEachForMulticast(message);
                    functions.logger.info(`Notificação do status ${newStatus} enviada ao cliente ${userId}.`);
                }
            }
        }
    } catch (error) {
        functions.logger.error(`Erro ao enviar notificação de status (${newStatus}) para o pedido ${orderId}:`, error);
    }
};

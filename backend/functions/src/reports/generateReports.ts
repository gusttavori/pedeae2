import * as functions from 'firebase-functions';
import { assertAdmin } from '../middlewares/authMiddleware';
import { db } from '../config/firebase';

/**
 * Console logístico para o papel de ADMIN focado em resumos diários ou fechamento.
 */
export const generateReports = functions.https.onCall(async (data, context) => {
    // Interrompe e desliga a função se client não tiver claims adequadas
    assertAdmin(context);

    // Construtores de tempo com defaults do dia atual
    const dateStart = data.startDate ? new Date(data.startDate) : new Date(new Date().setHours(0,0,0,0));
    const dateEnd = data.endDate ? new Date(data.endDate) : new Date(new Date().setHours(23,59,59,999));

    try {
        const ordersSnap = await db.collection('orders')
            .where('status', 'in', ['entregue', 'pronto']) // Contabilizar vendas consumadas
            .where('createdAt', '>=', dateStart)
            .where('createdAt', '<=', dateEnd)
            .get();

        let totalRevenue = 0;
        const productsCount: Record<string, number> = {};

        ordersSnap.forEach(doc => {
            const order = doc.data();
            totalRevenue += (order.total || 0);
            
            const items = order.items || [];
            items.forEach((item: any) => {
                if (!item.productId) return;
                
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
        
    } catch (error) {
        functions.logger.error('Erro na agregação de resultados do Firestore:', error);
        throw new functions.https.HttpsError('internal', 'Ocorreu um problema ao compilar os relatórios no servidor.');
    }
});

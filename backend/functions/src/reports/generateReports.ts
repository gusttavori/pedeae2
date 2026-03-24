// Engine Firebase Callables SDK 
import * as functions from 'firebase-functions';
// Importação Nosso GuardCosta Custom ADMs API Middlewares Validations
import { assertAdmin } from '../middlewares/authMiddleware';
// Db Native Instanciado Singleton DB Driver Core Backend Cloud
import { db } from '../config/firebase';

/**
 * Callable Func API. Que Mastiga o Banco de Dados Firestore C Onde Cluase Arrays e Gera Dto's Estatísticos Fechamento de Caixa Administrativo BI Panels Analytics API Analytics Endpoints Generator Methods 
 * Console logístico para o papel de ADMIN focado em resumos diários ou fechamento.
 */
export const generateReports = functions.https.onCall(async (data, context) => {
    // Para Tudo Se Chammada For de Usuario Comum Security Barrier Checks Protection Validations API Validations Rules Security Context Checks
    // Interrompe e desliga a função se client não tiver claims adequadas
    assertAdmin(context);

    // Usa Logica Date JS Pra Fazer Filtro Range TImes Dates "Hoje De Madruga" a "Hoje Meia Noite". Data Mappers Parse JS Native Params Query Config DB Queries Where Builder Timestamp Params Date Object Core Js Validations Rules Set Timestamp Rules Methods Get Set Object Times Date Time Functions Constructor Default Generators Time System Node Times Generator System Functions Date Instances Time Parameters Object Rules Methods Native Functions JS Methods Default Variables JS Method Date Builder Call Rules Settings Setup Timers Dates Builders Logic Data Generators Time Time Rules Setup System Generators Server Date Time Math Timestamp Functions Generator Generator Math System Objects Set Date Functions Time JS Object Data Core Time
    // Construtores de tempo com defaults do dia atual
    const dateStart = data.startDate ? new Date(data.startDate) : new Date(new Date().setHours(0,0,0,0));
    const dateEnd = data.endDate ? new Date(data.endDate) : new Date(new Date().setHours(23,59,59,999));

    try {
        // Consulta Banco de Dados Com Filtros de Data. Trazendo Apenas "Ganhos Liquidos = Ja Entregue e pago " Queries DB Rules Clauses Limit Range Time Date Date Filters Collection Database Search Matches Clause Query Firestore Query DB Builder DB Query Filters Operators Logic 
        const ordersSnap = await db.collection('orders')
            .where('status', 'in', ['entregue', 'pronto']) // Contabilizar vendas consumadas
            .where('createdAt', '>=', dateStart)
            .where('createdAt', '<=', dateEnd)
            .get(); // Triggers Exec Fetch Engine Firestore Returns Async Array DB Array Collections Array Results Document Data Returns Firebase Node Call Document Fetch Return Data Core Methods Document Fetch Array Result

        // Variavel Acumulador Caixa Master
        let totalRevenue = 0;
        // Hash Dic Map pra Contalibilizar "Mais vendidos". Qtd Prod Key / value Obj Record Type Array Keys Mappers 
        const productsCount: Record<string, number> = {};

        // Varredura Em Cada Documento/Pedido Listado Loop Iterator Firestore Collections Native Array Iterative Block Array Docs Loop Native Function Results DB Items Iterations Functions Array Results Iterate Arrays Results Methods Iterate Iterations
        ordersSnap.forEach(doc => {
            const order = doc.data(); // Limpa Doc pra Json
            totalRevenue += (order.total || 0); // Soma os Precos Acumulados
            
            // Loop dentro de Loop. Vai nos Itens Comprados Array do Carrinho Orders Iterations Arrays Array Sub Arrays
            const items = order.items || [];
            items.forEach((item: any) => {
                if (!item.productId) return;
                
                // Se AINDA nao tiver na HashLista de Mais Vendidos... POe LA cm Zero. Maps Inicialization
                if (!productsCount[item.productId]) {
                    productsCount[item.productId] = 0;
                }
                // Adiciona o Qtd desse Item Pro Contaodr Ranking Plus Math Math Quantities Math Increment
                productsCount[item.productId] += item.quantity;
            });
        });

        // Transforma Dicionario Em Array Ordenada (Sort) pelo "Maique Mais Vendeu primeiro" Mapping Logic Javascript Math Object Math Sort Objects JS Core Ranking Mapper Data Transformer Array Builder Map Functions Transformer Native Functions Sort Keys Method Arrays Method Transformer Logic Generator Algorithm Rankings Data Mappers Object API Code Node Data Native Generator Maps Algorithm Transform Keys Object Model Map Models 
        const topProducts = Object.entries(productsCount)
            .map(([productId, quantity]) => ({ productId, quantity }))
            .sort((a, b) => b.quantity - a.quantity);

        // Devolve Tudo JSON Limpinho pro Dashboard Frontend App Consmir API Payload Dto Interface View Response Server Model Render Return Values JSON Response Server JSON Object API Model 
        return {
            totalRevenue, // Receita total 
            totalOrders: ordersSnap.size, // Volume Pedidos (Array Docs Returns Firease Count Numbers
            topProducts, // Nosso Ranking Processado Array Mappers Sort 
            period: {
                start: dateStart.toISOString(), // Formatador String TImes Padrão 
                end: dateEnd.toISOString()
            }
        };
        
    } catch (error) {
        // Retorno Bonito Error Log Server Errors Caches System Catch Native API Errors Native Responses Core App Native Responses Log Exception Returns String Error Fallback Error Message API Fallback Native Exception Responses HTTP Call Error Returns Methods Try Log Errors System Exception Blocks Methods String Methods 
        functions.logger.error('Erro na agregação de resultados do Firestore:', error);
        throw new functions.https.HttpsError('internal', 'Ocorreu um problema ao compilar os relatórios no servidor.');
    }
});

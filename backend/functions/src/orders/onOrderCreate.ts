// Modulos Firebase Native Server Core Cloud Functions Node Environment Builder Libs Funcs Core DB
import * as functions from 'firebase-functions';
// Acesso Seguro Admin SDK Banco (Livre de Restrições Users) Database Singleton Config DB Firebase Server Core Engine Connection Server Object DB Cloud Db Hook Server Hook Variables Modules Constants Hooks
import { db } from '../config/firebase';

// Cria Listener Observer Gatilho Firestore Assíncrono Node.js 
// Função "onCreate": Executa Sempre que alguem no Planeta Criar ou Enviar um Pedido Novo pra Coleção Orders Tabela Database Orders Listeners 
export const onOrderCreate = functions.firestore
    .document('orders/{orderId}') // Assina Tabela Path Collections Target Path WildCard Listener Collection Target Observer Target Document Target Regex Path Tracker String Patterns Orders Listeners Document Path Matchers Node Regex Pattern Document Patterns Target Reference Mappers String Target Database Triggers Listeners Tabela WildCards IDs 
    .onCreate(async (snap, context) => { // Snap = Snapshot (Cópia da Foto Exata dos Dados do Pedido Feito) Cloud Trigger Event Payloads Payload Payload Triggers Trigger Exec Trigger Context Action Callback Async Functions Promisses Trigger Promisse Return Types
        // Pega objeto Json bruto DB Payload Documents JSON
        const orderData = snap.data();
        
        // Anti bugs null pointer Escape
        if (!orderData) return null;

        // Regra de Ouro Segurança DB (Backend Data Validation Model Patterns Hacking Defenses Security Server Core Pattern Design Validation Architecture Secure Backends Design Validator Values Integrity) : 
        // O FrontEnd/Celular envia TOTALS (100 reais). NUNCA CONFIE NA TELA Mobile API Hackers!
        // Recálculo seguro contra hack no front-end: iterar por itens buscando o valor verdadeiro
        let calculatedTotal = 0; // Cria Variavel Acumuloador Segura
        const validatedItems = []; // Array de Itens Limpos Confiáveis Safe array Objects

        // Laço (For of) Array Objects Carts. Iterate Array Orders Iteration Block For Iteration Objects 
        for (const item of orderData.items || []) {
            // Bug Checker Missing IDs Break Pointers Errors Break Limits
            if (!item.productId) continue;

            // Busca na Tabela PRODUTOS (Imutáveis DB Servidor Real Data Single Truth Pattern Data Architecture Values Product Table Query Get Product Database Collection Get Product Document ID Query DB Find ID Document Snapshot DB Returns Query DB Target Fetch ID Database Request Data API GET) o Produto Especifico Do Carrinho
            const productSnap = await db.collection('products').doc(item.productId).get();
            // Validacao Exsistencia Item
            if (productSnap.exists) {
                // Recupero Preco OFICIAL DO SERVIDOR Table Database Cloud DB
                const product = productSnap.data();
                const actualPrice = product?.price || 0; // Garantia Numeric 0
                
                // Calculo Limpo Imutável (Preco Oficial Google Server x Quantia Pedido Cliente Request API) Matemática Seguro Backend Server Core 
                calculatedTotal += actualPrice * item.quantity;
                // Preenche Items Confiáveis na Lista Valida Segura
                validatedItems.push({
                    productId: item.productId,
                    quantity: item.quantity, // Quantidade Pode ser a da Tela Qtd Params Variables Cart State
                    price: actualPrice // Sobrescrevendo o preço do Front End App Trocando pelo valor Real Integro DB Banco Firebase Cloud Security Pattern
                });
            }
        }

        // Fim Laco. Atualiza Proprio Documento No Banco Modificando a "Tentativa Inicial Hack/Bugada do App" pelos Valores Reais Recalculados DB Engine Update Trigers Action Response Methods Updates Methods Promisse Return Cloud DB Update Mutations Method Calls Data Update Triggers Data Methods
        // Atualizar o pedido com dados confiáveis
        return snap.ref.update({
            items: validatedItems, // Grava nova Lista Limpa
            total: calculatedTotal, // Soma da Notinha ServerSide Total Math Money
            status: 'pendente_pagamento', // Overwrite do "Status Firebase Pendente HardCooded KDS "
            verifiedAt: new Date() // Audit Logging. Informar P Dashboard que Esse Pedido é Seguro Passou No Gateway Middleware Cloud Validator System. Timestamp Universal Time Methods Time Stamp Date Core Library API Times Generator Builder Date Times Generate Methods.
        });
});

// Apenas Componentes Globais Db Instance Connection e Loggers Functions App Server Base Cloud Instances Config Import Server Base Utils Context 
import { db } from '../config/firebase';
import * as functions from 'firebase-functions';

/**
 * Função utilitária especializada em "Matemática De Estoque Seguro e Rápido". 
 * Função responsável por abater o estoque dos produtos
 * e atualizar a disponibilidade se o estoque zerar.
 */
// Recebe apenas Array Objetos Limpas Ex: [{id: 33, qtd: 2}, {id: 22, qtd: 3}] Model Payload Service Math Array Props Definitions Methods Method Signatures Types Checking Args Typed Payload Methods
export const updateStock = async (orderItems: Array<{ productId: string, quantity: number }>) => {
    // "Batch" (Lote). É Uma Funcionalidade do Banco Firtore. Permite eu ENFILEIRAR Várias mudanças de banco, e mandar tudo no Sockets num "Tiro Só". Ganha Performance e Econômiza Dinheiro Google Cloud (Custa 1 read vs 5 updates avulsos). Transaction Blocks Database Commits Atomic Updates Data Updates Operations Bulk Pattern Database Engine Batch Write Commit Batch Updates Bulk Methods Cloud Firestore Batch Transaction Atomic Operations
    const batch = db.batch();
    
    // Roda Em Cima dos Itens Trazidos Iterations Collections Iterators For In Object Values Mapping Loop Items
    for (const item of orderItems) {
        if (!item.productId) continue; // Escappa Null Pointers Security Bugs Exceptions Errors Array Items Skip Null Checks Continue For Control Flow 

        // Mira O ID Físico daquel lanche que comprou na Tabela Docs DB Target DB Refs Search References Target Pointers Database 
        const productRef = db.collection('products').doc(item.productId);
        const productSnap = await productRef.get(); // Puxa Ficha Completa Promisses Returns Object Document Target Returns Async Find Method 
        
        // Verifica Exitencia DB Missing Doc Errors Bug Defense Fail Checks If Docs Exceptions Validations 
        if (!productSnap.exists) {
            functions.logger.warn(`Produto ${item.productId} não encontrado ao atualizar estoque.`);
            continue;
        }

        // Pega Quantia Q Tem agr No banco Json Access Objects Value Parse
        const data = productSnap.data();
        const currentStock = data?.stock || 0; // Quantos Hamburugueres Tem Na Nuvem agr Math Numeric Values Security Zero Default Safe Math Math Num Limits
        // Abate A quantidade Da notinha (Ex: Tinha 10 - Comprei 3 = Salva 7). Usamos "Math.max" Evita Ficar "-3 no Banco" Zero Minimo Fixes Boundary Controls Safe Subtrations Math Limit Math Checks Values Engine Min Max Values Numbers Algorithms JS Methods Functions Logic Limits Boundings Limits Array Functions Min Values Number Limits Logic Control Values Negative Checks Safe Integers Math Constraints Functions Subtraction Integer Mathematics
        const newStock = Math.max(0, currentStock - item.quantity);
        // Atualiza a Chave Booleana UI Front. Se Agora o Estoque Novo ficou (Zero e nao Negativo), Retorna FALSE desligando o Btoão App Mobile Availability States Boolean Switches Variables Rules Flags Controls Truth Object Truth Properties Operators State Boolean Update States 
        const available = newStock > 0 && data?.available !== false;

        // Enfileira Alteração Mútipla Pra Carga No Tiro (Prepara o Update não Desapara ainada) Add Queue Batch Updates Queues Mutations Add Actions Mutation Stash Stage Data 
        batch.update(productRef, {
            stock: newStock,   // Atualiza Numeral Quantities Updates 
            available: available // Atualiza UI Desligado Booleans Toggle Update True Falses
        });
    }

    // O "Tiro" de Uma Vez. Roda todas Modificaçoes num pacote so Otimizado Save Execution Transaction Writes Updates Saves Execution Async Bulk Trigger Saves.
    // Executa e commita as alterações no firebase
    await batch.commit();
};

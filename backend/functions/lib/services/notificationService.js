"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyStatusChange = void 0;
// Importa do Nosso Arquivo Base as Instancias Master de Conexao Com DB e Com Modulo de Mensageria FCM Google Messaging Push
const firebase_1 = require("../config/firebase");
// Motor FireBase Node Cloud Utils Logic Log Triggers Node App Handlers Request Logger 
const functions = __importStar(require("firebase-functions"));
/**
 * Função responsável por agrupar lógica de push notification no FCM.
 * Centraliza os disparos de Apitos Celular PopUps Push Notification App React Native Push Tokens
 */
const notifyStatusChange = async (orderId, userId, newStatus) => {
    try {
        // Maquina Reações: Se Aprovbou Dinheiro...
        if (newStatus === 'novo') {
            // Notificar a COZINHA (Painel KDS / Celulares dos Cozinheiros App Cozinha Firebase Collections Filters Search Query Builders Database Select Where Query Firebase)
            const cozinhaUsers = await firebase_1.db.collection('users').where('role', '==', 'COZINHA').get();
            // Var Acumuladora de Celulares/Tokens
            let tokens = [];
            // Loop Em todos Cozinheiros Contratados Pela Loja Mappings Array Returns Maps Collections 
            cozinhaUsers.forEach(doc => {
                const userTokens = doc.data().fcmTokens || []; // Salva os "IDs de Celulares" Deles (Posso ter Iphone e Ipad logados) Device Tokens Token Manager Access DB List Collections
                tokens = [...tokens, ...userTokens]; // Espalha (Spread) as arrays Juntando Tudo Numa Grande Lita Array Pointers Append Spread Operador Collections Merge
            });
            // Filtro Seguranca: Limpa Array Tirando Duplicados, Undefineds Pointers Null Token Clean Unique Keys Maps Array Validation Typescript Validations Filter Set Filters Javascript Array Objects Mapping Sets
            // Filtra tokens válidos e únicos
            tokens = [...new Set(tokens.filter(t => typeof t === 'string' && t.length > 0))];
            // Condicao: Se achou alguem da Cozinha Registrado com celular ligado pra Receber Aviso Verify Validation Push Send Validation Numbers Validations Send Message Tokens Validation Notifications Checks Token Payload App User Token Dispatcher
            if (tokens.length > 0) {
                // Monta Corpo da MSG Padrão JSON Firebase Cloud Messaging Dto FCM API Format Push Format Dtos Notifications Body Title Object Data Meta Models FCM Model Types 
                const message = {
                    notification: {
                        title: '✅ Novo Pedido PedeAê!',
                        body: `Um novo pedido pago chegou (#${orderId}). Veja os detalhes na fila!`
                    },
                    data: { orderId, status: newStatus, link: '/dashboard' }, // App Le Isso Clicavel e Redireciona Deeplinking
                    tokens // Passa Miltiplos Destinatários Disparo em Masa Multicast Targets Arrays Tokens Target Multicast Dispatcher Multiple Send FCM Target Push Payload Arrays Message Dispatches Multicast
                };
                // Atira MSG Promisse Wait Send Google Servers Push Request FCM Push Calls Request Sends
                await firebase_1.messaging.sendEachForMulticast(message);
                // Auditoria
                functions.logger.info(`Notificação de pedido ${orderId} enviada para cozinha (${tokens.length} tokens).`);
            }
            // Maquina Reacoes Parte 2: Se A cozinha Mudou Status No Painel KDS Pra (Ta fazneo, Saiu p etrega) Matcher Transitions Switch Logic Routing Routing Notifications Switches 
        }
        else if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
            // Notificar o CLIENTE (Busco ID Unico do Cliente No Banco Pra avisar Sò a Ele) Query DB Matcher ID Data Search ID Client Targets ID
            const userSnap = await firebase_1.db.collection('users').doc(userId).get();
            // Seguranca Exisntecia Validation Null Undefs Object 
            if (userSnap.exists) {
                // Limpo Tokens dos Aparelhos do CLiente Filter Map Values 
                const userTokens = userSnap.data()?.fcmTokens || [];
                const validTokens = [...new Set(userTokens.filter((t) => typeof t === 'string' && t.length > 0))]; // Validations Check Empty String String Maps Types 
                // Textos Dinamicos Strings Switch Var Template Generators View Labels
                let title = 'Atualização do seu Pedido';
                let body = `Seu pedido está no status: ${newStatus}`;
                // Tradutor Humano Machine Learning State to Text Mappers String Parsers UI Map 
                if (newStatus === 'preparando') {
                    title = '👨‍🍳 Pedido sendo Preparado!';
                    body = 'Sua comida já está sendo preparada e logo estará pronta.';
                }
                else if (newStatus === 'pronto') {
                    title = '🔔 Pedido Pronto!';
                    body = 'Seu pedido já pode ser retirado ou está aguardando entrega.';
                }
                else if (newStatus === 'entregue') {
                    title = '🎉 Pedido Entregue!';
                    body = 'Aproveite sua refeição! O PedeAê agradece a preferência.';
                }
                // Dispara So Se Cliente Tiver Token push Push Target Validations Send App Request Dispatch Condition 
                if (validTokens.length > 0) {
                    const message = {
                        notification: { title, body },
                        data: { orderId, status: newStatus }, // Passa Metadado Pro Celular Rotaer
                        tokens: validTokens
                    };
                    // Atirador FCM Core Promisses Action Async Methods 
                    await firebase_1.messaging.sendEachForMulticast(message);
                    functions.logger.info(`Notificação do status ${newStatus} enviada ao cliente ${userId}.`); // View Log
                }
            }
        }
    }
    catch (error) {
        // Captura Vermelha Logs Errors Traces Exceptions Monitoring Handlers Exceptions
        functions.logger.error(`Erro ao enviar notificação de status (${newStatus}) para o pedido ${orderId}:`, error);
    }
};
exports.notifyStatusChange = notifyStatusChange;
//# sourceMappingURL=notificationService.js.map
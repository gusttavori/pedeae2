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
exports.onOrderStatusChange = void 0;
// SDK Base do Core Engine Google Serverless Cloud Functions Library Node Functions Triggers 
const functions = __importStar(require("firebase-functions"));
// Função de Serviço Customizada Reutilizavel para Dar Baixa ou Repor Estoques Update Product Stocks Service Imports Services
const stockService_1 = require("../services/stockService");
// Func Serviço Custom Alertas de Notificações de Celular Push Mobile Alerts Send Alerts Token Dispatchers
const notificationService_1 = require("../services/notificationService");
// Exporta mais um "Cloud Trigger Automático Event Driven" Assíncrono . "OnUpdate" 
// Este atira Sempre Que ALGUMA MUDANCA For Escrita Num Pedido Existente Ex (Status Pendente -> Novo) Listener FireStore Collections Observers Mutations Tracker Events
exports.onOrderStatusChange = functions.firestore
    .document('orders/{orderId}') // Fica Observando A Colecao De Pedidos (Orders Matches Regex Paths Documents Tracker) Event Sources
    .onUpdate(async (change, context) => {
    // Extrai o JSON antigo
    const before = change.before.data();
    // Extrai o JSON modificado
    const after = change.after.data();
    // ID Extraido da Regex Path da Colecao WildCards params Identifiers Contexts
    const orderId = context.params.orderId;
    // Variaveis de Controle para Maquina de Estados Finitos Status Change Status Tracker Old vs New
    const oldStatus = before.status;
    const newStatus = after.status;
    // Se o status não mudou (Foi Uma update Bobeira tipo "O Cliente mudou o endereco string" mas O status ta igual, evitamos Disparar notificações de Pagamento atoa. Early Stop Returns Break Optimizations
    // Se o status não mudou, evitamos redundância
    if (oldStatus === newStatus)
        return null;
    // Auditoria Cloud Watch Tracing Actions Console Info Logger Server Monitors Console Tracking Monitor 
    functions.logger.info(`Pedido ${orderId} mudou de ${oldStatus} para ${newStatus}`);
    // Regra Negocio Pagamentos e KDS Dashboard: Se Pagou Com Sucesso Cai Pra Novo "Liberando p Cozinha Fazer". State Machines Flow Logic Check Status Transition Check Payment Approved Webhook Handlers Integrations
    // Quando o pagamento é aprovado via webhook, o status transiciona para "novo"
    if (newStatus === 'novo' && oldStatus === 'pendente_pagamento') {
        // Executa Abatimento/Logica DB Produtos pra Impedir Furo de Estoque. Service Layer Architecture Db Calls Wait Update Stock 
        await (0, stockService_1.updateStock)(after.items || []);
        // Manda um APito p Celular do Cara (Firebase FCM Service Push): "Pagamento Aprovado Seu Pedido foi Para Cozinha!" Notification APNS Push User Token 
        await (0, notificationService_1.notifyStatusChange)(orderId, after.userId, 'novo');
        // Mata a execução Terminate Cloud Action 
        return null;
    }
    // Regras de Aviso Praça Notitication Push Tracking States Progress Machine Tracking Customer Notification Apps Celular View Tracking Status Orders Mobile Progress
    // Notificações orientadas ao cliente sobre preparações
    if (['preparando', 'pronto', 'entregue'].includes(newStatus)) {
        // Dispara apito Celular ("Seu lanche ta fazendo", "Lanche Pronto", "Saiu p Entrega") Notification Core Function Alerts Dispatches Mobile Device App 
        await (0, notificationService_1.notifyStatusChange)(orderId, after.userId, newStatus);
        // Terminate Function
        return null;
    }
    return null;
});
//# sourceMappingURL=onOrderStatusChange.js.map
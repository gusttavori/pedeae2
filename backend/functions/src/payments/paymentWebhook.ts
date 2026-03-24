import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

/**
 * Funcção Node Server Endpoint Criado como HTTP DIRECT RAW puro (onRequest ao Inves de onCall). Webhooks Externos Ex: "Servidor Mercadopago Clicando Numa URl Pra Avisar Que Aprovou" 
 * HTTP REST endpoint focado em recepcionar callbacks vindos do Gateway de Pagamento,
 * logo, não usaremos o utilitaritário onCall (que carrega token client-side automático).
 */
export const paymentWebhook = functions.https.onRequest(async (req, res) => {
    // Trava de Seguranca Block De Metodos Q Devem Ser Restringidos HTTP Methods Webhook Patterns (So Aceita POST Payload Body Data JSON Request Headers Payload Receive Server Webhooks Payload Config Payload Validation Model Http Standard Method Validator API Rest Design Pattern Methods
    // Webhooks costumam ser via POST
    if (req.method !== 'POST') {
        res.status(405).send('O método fornecido não é suportado.'); // Early Return Fast Fail HTTP Codes Methods 
        return;
    }

    // Destroi O Json Postado body Request Post Params Desctructions 
    const { orderId, status } = req.body;

    // Criptografia Simples Defences Hack Gateway (A chave Mestre Q O MercadoPago Usa Pra Enviar.  E voce Sabe Tbm. Protege a Rota Muted Route Validations Hmac Webhook Secures API Token Authorization App Secrets Envs Context Keys Validator Secret Key Validations Header Token Token Verify Key API Header Authentication HTTP Webhooks Secures Keys Tokens Secret Tokens Header Tokens Security Headers Secret Keys Keys Token Keys Security API Methods Security Codes Validation Methods Keys Keys Controls Server Request Validation Authorization Rules Server Middleware Check Authorizations HTTP Code Verify 
    // Autenticação mockada contrainjeções 
    // Em um cenário real usa-se assinatura do corpo do Stripe, HMAC do Pagar.me ou tokens definidos no console
    const internalSecret = req.headers['x-webhook-token'];
    
    // Comparação Da Senha Header Com  a Chave Padrão Master (ideal por no bash env ) Hardcoded String Validation 
    // Supondo que em production configuramos o secret das functions config ou variáveis de ambiente
    if (internalSecret !== 'sua-chave-secreta-webhook-pedeae-2026') {
        functions.logger.warn(`Chamada não autêntica para o pedido: ${orderId}`); // Log Tentativa Hacker Security Logs System 
        res.status(401).send('Não autorizado.'); // Response 401 Auth HTTP UnHautherized Response Return Payload
        return;
    }

    // Logica Mudança Bancoc DB Change Status Workflow Logic KDS 
    // Lógica para marcar pagamento na collection "orders"
    if (status === 'approved' && orderId) {
        try {
            const orderRef = db.collection('orders').doc(orderId); // Pega Ref 
            const orderSnap = await orderRef.get(); // Pega Dados Docs Banco Get Collections Return Snapshots Fetch Query Firestore Methods Method Promisses Call Backend DB
            
            // Segurança Evita Quebrar DB 
            if (!orderSnap.exists) {
                functions.logger.warn(`Recebemos webhook para pedido não existente: ${orderId}`);
                res.status(404).send('Pedido inlocalizável.'); // Response Native 404 Error 
                return;
            }

            // Garante Q nao Aprove Pedido 2 vezes
            const currentStatus = orderSnap.data()?.status;
            if (currentStatus === 'pendente_pagamento') {
                // Modifica Banco (E isso Automaticamente Acorda outro EventListener Na Nuvem o .onUpdate Firebase Observers Firestore Triggers Events Database)
                // Ao efetuar esta mutação no Firebase, o trigger `onOrderStatusChange`
                // é engatilhado no background magicamente!
                await orderRef.update({ 
                    status: 'novo', // Acorda O Celular e a Maquinha de Cozinha KDS App State Dashboard 
                    paymentApprovedAt: admin.firestore.FieldValue.serverTimestamp() // Timestamp Pagamentos BI Banco Data Analytics DB Value Store Date 
                });
                
                // Grava Em Banco Log sucesso Monitorings 
                functions.logger.info(`Pagamento liquidado via webhook com sucesso. ID Origem: ${orderId}`);
            }

            // Webhooks Precisam Que voce Devolva 200 PRA ELES Pararem de Enviar Retentativas "Retry"
            res.status(200).send({ received: true });
        } catch (error) {
            // Logs Error
            functions.logger.error('Erro transacional na recepção do gateway:', error);
            res.status(500).send('Erro interno do servidor.');
        }
    } else {
        // Formato Errado Fallback Fail Errors JSON 
        res.status(400).send('Payload malformado.');
    }
});

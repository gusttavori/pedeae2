// API Principal do Firebase Cloud Functions (Permite escutar eventos na Nuvem) Backend Serverless
import * as functions from 'firebase-functions';
// Admin SDK de privilégio máximo do Firebase (Bypass nas regras de segurança do Firestore database Rules) Root Access Database
import * as admin from 'firebase-admin';
// Nossa Instância Global (Central de config) Exportada com Acesso ao Auth (Contas) e DB (Node/Collections Firestore)
import { auth, db } from '../config/firebase';

// Exporta Função Assincrona Cloud. Event Listener Autônomo na nuvem (.onCreate) que Dispara Sozinho toda vez que uma conta/usuário novo termina de se registrar no sistema pelo APP. Node.js backend logic
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
    // Desestrutura o objeto gigante "user" para pegar apenas o E-mail de cadastro e o ID Único (UID Firebase hash auth ID Token)
    const { email, uid } = user;
    
    // Regra Lógica de Negócios Backend: Apenas o usuário com email Exato "admin@pedeae.com.br" ganha poderes administrativos.
    // Variável Local Definitiva de Níveis de Acesso Padrão: Usuários comuns novos são "CLIENTE" por padrão (Fail-Safe security Role based architecture)
    let role = 'CLIENTE';
    
    // Condicional Master de Concedimento de Perfil Hierárquico: Se for o Dono App. Mude a str da Váriavel
    if (email === 'admin@pedeae.com.br') {
        role = 'ADMIN';
    }

    // Try/Catch: Tratativa de erros de rede ou promessas para não crashar ou "travar" a função no meio. Error Handling Block Promises
    try {
        // Passo Mágico Admin: Injeta "Custom Claims" (Marcas/Carimbos ocultos de JWT Token). Isso viaja no token invisivel do cliente para o Front End Frontend Router Checar dps se o cara é ADM ou não nas views. (Token Metadata Injection)
        // Armazenar a role na Custom Claim do token
        await auth.setCustomUserClaims(uid, { role });
        
        // Espelhamento NoSql: Além Ciar Usuário no módulo "Auth", cria um espelho visível dele na Collection Tabela "users" no Banco Firestore NoSQL Table Documents Collections Root Structure 
        // Armazenar informações no Firestore
        await db.collection('users').doc(uid).set({
            id: uid, // Id Primary Key Copiada Idêntica App Authentication Token Id
            email: email || '', // Previne Nulls c Falbacks
            role: role, // Salva o Nivel de acesso na Tabela Visível tbm Client DB Reading
            fcmTokens: [], // Array Pronta em Branco esperando receber Tolens Push Notification de Celular Celullar Notification Tokens Firebase Cloud Messaging
            createdAt: admin.firestore.FieldValue.serverTimestamp() // Pede ao Relório Atômico Preciso Oficial do Servidor Master do Google pra Inserir Hora Criada Oficial Universal DB Timestamp
        });
        
        // Console Log Profissional da Google Cloud System Logs (Monitoramento Observability Google Cloud Plataform Logging Monitor View Terminal Functions Dashboard Logger )
        functions.logger.info(`Usuário ${uid} criado e classificado como ${role}.`);
    } catch (error) {
        // Envia "Erro Vermelho Fatal" Pro sistema de Logs Cloud Watch Crashlitys do Projeto Painel Google 
        functions.logger.error('Erro ao definir role ou criar doc do usuáro:', error);
    }
});

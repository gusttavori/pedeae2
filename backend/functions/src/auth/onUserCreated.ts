import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { auth, db } from '../config/firebase';

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
    const { email, uid } = user;
    
    // Regra: Apenas o usuário com email "admin@pedeae.com.br" possui role ADMIN
    // Usuários comuns são CLIENTE por padrão
    let role = 'CLIENTE';
    
    if (email === 'admin@pedeae.com.br') {
        role = 'ADMIN';
    }

    try {
        // Armazenar a role na Custom Claim do token
        await auth.setCustomUserClaims(uid, { role });
        
        // Armazenar informações no Firestore
        await db.collection('users').doc(uid).set({
            id: uid,
            email: email || '',
            role: role,
            fcmTokens: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        functions.logger.info(`Usuário ${uid} criado e classificado como ${role}.`);
    } catch (error) {
        functions.logger.error('Erro ao definir role ou criar doc do usuáro:', error);
    }
});

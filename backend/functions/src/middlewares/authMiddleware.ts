import * as functions from 'firebase-functions';

/**
 * Utilitário para ser utilizado em funções Callable (onCall) 
 * que valida se o usuário que invocou a função é ADMIN.
 */
export const assertAdmin = (context: functions.https.CallableContext) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'O usuário deve estar autenticado.'
        );
    }

    // A Role Custom Claim é acessível no objeto de auth de funções Callable
    if (context.auth.token.role !== 'ADMIN') {
        throw new functions.https.HttpsError(
            'permission-denied', 
            'O acesso a esta função requer privilégios de Administrador.'
        );
    }
};

/**
 * Utilitário para validar autorização mínima (ser cliente/usuário autenticado).
 */
export const assertAuthenticated = (context: functions.https.CallableContext) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'O usuário deve estar autenticado.'
        );
    }
};

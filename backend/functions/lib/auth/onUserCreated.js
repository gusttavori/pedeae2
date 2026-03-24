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
exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const firebase_1 = require("../config/firebase");
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const { email, uid } = user;
    // Regra: Apenas o usuário com email "admin@pedeae.com.br" possui role ADMIN
    // Usuários comuns são CLIENTE por padrão
    let role = 'CLIENTE';
    if (email === 'admin@pedeae.com.br') {
        role = 'ADMIN';
    }
    try {
        // Armazenar a role na Custom Claim do token
        await firebase_1.auth.setCustomUserClaims(uid, { role });
        // Armazenar informações no Firestore
        await firebase_1.db.collection('users').doc(uid).set({
            id: uid,
            email: email || '',
            role: role,
            fcmTokens: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        functions.logger.info(`Usuário ${uid} criado e classificado como ${role}.`);
    }
    catch (error) {
        functions.logger.error('Erro ao definir role ou criar doc do usuáro:', error);
    }
});
//# sourceMappingURL=onUserCreated.js.map
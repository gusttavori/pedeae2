import React, { useEffect, useState } from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../src/config/firebase';
import { ActivityIndicator, View } from 'react-native';

export default function AdminLayout() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Estado do Usuário mudou:", currentUser ? "LOGADO" : "DESLOGADO");
            setUser(currentUser);
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [initializing]);

    useEffect(() => {
        if (initializing) return;

        const isLoginScreen = pathname === '/admin/login';

        if (!user && !isLoginScreen) {
            console.log("Bloqueado! Redirecionando para Login...");
            router.replace('/admin/login');
        } else if (user && isLoginScreen) {
            console.log("Já está logado! Indo para o Dashboard...");
            router.replace('/admin/dashboard');
        }
    }, [user, initializing, pathname]);

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', height: '100vh' }}>
                <ActivityIndicator size="large" color="#FF8C00" />
            </View>
        );
    }

    return <Slot />;
}
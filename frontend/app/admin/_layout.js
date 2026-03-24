// Importa o React e hooks para controle de ciclo de vida e estado
import React, { useEffect, useState } from 'react';
// Importa componentes e hooks de navegação do expo-router
import { Slot, useRouter, usePathname } from 'expo-router';
// Importa a função do Firebase que escuta mudanças na autenticação
import { onAuthStateChanged } from 'firebase/auth';
// Importa a instância de autenticação do nosso projeto
import { auth } from '../../src/config/firebase';
// Importa componentes visuais do React Native
import { ActivityIndicator, View } from 'react-native';

// Exporta o componente de layout que envolve todas as telas da área admin
export default function AdminLayout() {
    // Estado para controlar se o app ainda está verificando o login ao abrir
    const [initializing, setInitializing] = useState(true);
    // Estado para armazenar os dados do usuário logado
    const [user, setUser] = useState(null);
    
    // Inicializa o roteador para forçar navegações
    const router = useRouter();
    // Obtém o caminho atual da URL/tela
    const pathname = usePathname();

    // Hook que executa uma vez ao montar o componente
    useEffect(() => {
        // Inscreve um ouvinte do Firebase para verificar se o usuário está logado
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Estado do Usuário mudou:", currentUser ? "LOGADO" : "DESLOGADO");
            // Atualiza o estado com as informações do usuário
            setUser(currentUser);
            // Se estava inicializando, marca como concluído
            if (initializing) setInitializing(false);
        });

        // Limpa o ouvinte quando o componente for desmontado para evitar vazamento de memória
        return () => unsubscribe();
    }, [initializing]); // A dependência garante que use o estado mais recente de 'initializing'

    // Hook para controlar a proteção das rotas (redirecionamento)
    useEffect(() => {
        // Se ainda estiver carregando a verificação de auth, não faz nada
        if (initializing) return;

        // Verifica se a tela atual é a tela de login
        const isLoginScreen = pathname === '/admin/login';

        // Se o usuário não está logado e tenta acessar uma tela que não seja o login
        if (!user && !isLoginScreen) {
            console.log("Bloqueado! Redirecionando para Login...");
            // Redireciona à força para a tela de login
            router.replace('/admin/login');
        } 
        // Se o usuário está logado mas tenta abrir a tela de login
        else if (user && isLoginScreen) {
            console.log("Já está logado! Indo para o Dashboard...");
            // Redireciona à força para o painel principal do admin
            router.replace('/admin/dashboard');
        }
    }, [user, initializing, pathname]); // Re-executa se qualquer uma destas variáveis mudar

    // Se a autenticação estiver sendo carregada, exibe uma tela de carregamento (spinner)
    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', height: '100vh' }}>
                <ActivityIndicator size="large" color="#FF8C00" />
            </View>
        );
    }

    // Se a verificação passou, renderiza a tela filha atual apropriada usando <Slot />
    return <Slot />;
}
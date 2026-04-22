import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Ferramentas para ouvir o banco em tempo real e atualizar documentos específicos
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../src/config/firebase';

import { styles } from './PedidosScreen.styles';

// Lista de categorias para a barra de abas (Tabs) superior
const STATUS_LIST = ['Todos', 'Novos', 'Preparando', 'Prontos', 'Entregues'];

export default function PedidosScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Todos'); // Controla qual aba está selecionada
    const [pedidos, setPedidos] = useState([]); // Armazena a lista total de pedidos do banco
    const [loading, setLoading] = useState(true); // Controla o estado de carregamento inicial

    // --- ESCUTA EM TEMPO REAL ---
    useEffect(() => {
        // Busca todos os pedidos, ordenando pelos mais recentes primeiro
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'desc'));
        
        // O onSnapshot cria um canal aberto com o Firebase. Mudou lá, muda aqui na hora!
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPedidos(lista);
            setLoading(false);
        });

        // Importante: Fecha a conexão ao sair da tela para não gastar dados à toa
        return () => unsubscribe();
    }, []);

    /**
     * Função para mover o pedido no fluxo (ex: de Pendente para Preparando)
     */
    const alterarStatus = async (pedidoId, novoStatus) => {
        try {
            // Referencia o documento exato do pedido pelo ID
            const pedidoRef = doc(db, 'pedidos', pedidoId);
            // Atualiza apenas o campo 'status' no Firebase
            await updateDoc(pedidoRef, { status: novoStatus });
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            Alert.alert("Erro", "Não foi possível atualizar o status do pedido.");
        }
    };

    // --- FILTRAGEM DINÂMICA ---
    // Esta lógica filtra a lista de pedidos baseada na aba que o usuário clicou
    const pedidosFiltrados = pedidos.filter(p => {
        if (activeTab === 'Todos') return true;
        if (activeTab === 'Novos') return p.status === 'pendente';
        if (activeTab === 'Preparando') return p.status === 'preparando';
        if (activeTab === 'Prontos') return p.status === 'pronto';
        if (activeTab === 'Entregues') return p.status === 'entregue';
        return true;
    });

    // Helpers visuais: definem as cores dos cards e etiquetas (badges) conforme o status
    const getCardStatusStyle = (status) => {
        switch(status) {
            case 'pendente': return styles.statusPendente;
            case 'preparando': return styles.statusPreparando;
            case 'pronto': return styles.statusPronto;
            default: return {};
        }
    };

    const getBadgeStyle = (status) => {
        switch(status) {
            case 'pendente': return { bg: styles.badgeBgPendente, text: styles.badgeTextPendente };
            case 'preparando': return { bg: styles.badgeBgPreparando, text: styles.badgeTextPreparando };
            case 'pronto': return { bg: styles.badgeBgPronto, text: styles.badgeTextPronto };
            default: return { bg: {}, text: {} };
        }
    };

    return (
        <View style={styles.kdsContainer}>
            {/* CABEÇALHO COM LOGO */}
            <View style={styles.kdsHeader}>
                <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                
                <View style={styles.headerCenter}>
                    <Image 
                        source={require('../../../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.kdsSubtitle}>Painel da Cozinha</Text>
                </View>
                <View style={{ width: 40 }}></View>
            </View>

            {/* BARRA DE ABAS (FILTROS DE STATUS) */}
            <View style={styles.tabBarContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
                    {STATUS_LIST.map((tab) => (
                        <TouchableOpacity 
                            key={tab}
                            activeOpacity={0.8}
                            style={[styles.tabItem, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* CONTEÚDO PRINCIPAL (LISTA DE PEDIDOS) */}
            <View style={styles.kdsContent}>
                {loading ? (
                    <View style={styles.centerInfo}>
                        <ActivityIndicator size="large" color="#E33E42" />
                        <Text style={styles.centerInfoText}>Sincronizando pedidos...</Text>
                    </View>
                ) : pedidosFiltrados.length === 0 ? (
                    <View style={styles.centerInfo}>
                        <Ionicons name="restaurant-outline" size={60} color="#DDDDDD" />
                        <Text style={styles.centerInfoText}>Nenhum pedido nesta categoria.</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.ordersGrid}>
                            {pedidosFiltrados.map((pedido) => {
                                const badgeStyles = getBadgeStyle(pedido.status);

                                return (
                                    <View key={pedido.id} style={[styles.orderCard, getCardStatusStyle(pedido.status)]}>
                                        {/* TOPO DO CARD: Código e Mesa */}
                                        <View style={styles.cardHeader}>
                                            <View style={styles.orderInfo}>
                                                <Text style={styles.orderCode}>
                                                    #{pedido.id.substring(0, 4).toUpperCase()}
                                                </Text>
                                                <Text style={styles.orderMesa}>Mesa {pedido.mesa}</Text>
                                            </View>
                                            
                                            <View style={[styles.badgeStatus, badgeStyles.bg]}>
                                                <Text style={[styles.badgeText, badgeStyles.text]}>
                                                    {pedido.status === 'pendente' ? 'NOVO' : pedido.status}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* CORPO DO CARD: Lista de Itens do pedido */}
                                        <View style={styles.cardBody}>
                                            {pedido.itens.map((item, idx) => (
                                                <View key={idx} style={styles.orderItem}>
                                                    <Text style={styles.itemQty}>{item.quantity}x</Text>
                                                    <Text style={styles.itemName}>{item.title || item.nome}</Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* RODAPÉ: Horário e Botões de Ação */}
                                        <View style={styles.cardFooter}>
                                            <Text style={styles.orderTime}>
                                                {new Date(pedido.criadoEm?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                            
                                            <View style={styles.actionArea}>
                                                {/* Botões inteligentes: só aparecem o botão da próxima etapa do processo */}
                                                {pedido.status === 'pendente' && (
                                                    <TouchableOpacity 
                                                        style={[styles.btnAction, styles.btnPreparar]} 
                                                        onPress={() => alterarStatus(pedido.id, 'preparando')}
                                                    >
                                                        <Text style={styles.btnTextAction}>PREPARAR</Text>
                                                    </TouchableOpacity>
                                                )}
                                                {pedido.status === 'preparando' && (
                                                    <TouchableOpacity 
                                                        style={[styles.btnAction, styles.btnPronto]} 
                                                        onPress={() => alterarStatus(pedido.id, 'pronto')}
                                                    >
                                                        <Text style={styles.btnTextAction}>PRONTO</Text>
                                                    </TouchableOpacity>
                                                )}
                                                {pedido.status === 'pronto' && (
                                                    <TouchableOpacity 
                                                        style={[styles.btnAction, styles.btnEntregar]} 
                                                        onPress={() => alterarStatus(pedido.id, 'entregue')}
                                                    >
                                                        <Text style={styles.btnTextAction}>ENTREGAR</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
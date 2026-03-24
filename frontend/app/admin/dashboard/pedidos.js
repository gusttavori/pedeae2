import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ActivityIndicator } from 'react-native';

// Firebase
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../src/config/firebase';

// CSS Separado
import './pedidos.css';

const STATUS_LIST = ['Todos', 'Novos', 'Preparando', 'Prontos', 'Entregues'];

export default function PedidosScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Todos');
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Escuta os pedidos do Firebase em tempo real
    useEffect(() => {
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPedidos(lista);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Altera o status do pedido no Banco de Dados
    const alterarStatus = async (pedidoId, novoStatus) => {
        try {
            const pedidoRef = doc(db, 'pedidos', pedidoId);
            await updateDoc(pedidoRef, { status: novoStatus });
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar o pedido.");
        }
    };

    // 3. Filtro de Abas
    const pedidosFiltrados = pedidos.filter(p => {
        if (activeTab === 'Todos') return true;
        if (activeTab === 'Novos') return p.status === 'pendente';
        if (activeTab === 'Preparando') return p.status === 'preparando';
        if (activeTab === 'Prontos') return p.status === 'pronto';
        if (activeTab === 'Entregues') return p.status === 'entregue';
        return true;
    });

    return (
        <div className="kdsContainer">
            {/* Header */}
            <header className="kdsHeader">
                <button className="backBtn" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                <div className="headerCenter">
                    <Image 
                        source={require('../../../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                    <span className="kdsSubtitle">Painel da Cozinha</span>
                </div>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Abas de Filtro */}
            <div className="tabBar">
                {STATUS_LIST.map((tab) => (
                    <button 
                        key={tab}
                        className={`tabItem ${activeTab === tab ? 'tabActive' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Conteúdo Principal */}
            <main className="kdsContent">
                {loading ? (
                    <div className="centerInfo">
                        <ActivityIndicator size="large" color="#E33E42" />
                        <p>Sincronizando pedidos...</p>
                    </div>
                ) : pedidosFiltrados.length === 0 ? (
                    <div className="centerInfo">
                        <Ionicons name="restaurant-outline" size={60} color="#DDD" />
                        <p>Nenhum pedido encontrado.</p>
                    </div>
                ) : (
                    <div className="ordersGrid">
                        {pedidosFiltrados.map((pedido) => (
                            <div key={pedido.id} className={`orderCard status-${pedido.status}`}>
                                <div className="cardHeader">
                                    <div className="orderInfo">
                                        <span className="orderCode">#{pedido.id.substring(0, 4).toUpperCase()}</span>
                                        <span className="orderMesa">Mesa {pedido.mesa}</span>
                                    </div>
                                    <span className={`badgeStatus badge-${pedido.status}`}>
                                        {pedido.status === 'pendente' ? 'Novo' : pedido.status}
                                    </span>
                                </div>

                                <div className="cardBody">
                                    {pedido.itens.map((item, idx) => (
                                        <div key={idx} className="orderItem">
                                            <span className="itemQty">{item.quantity}x</span>
                                            <span className="itemName">{item.title || item.nome}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="cardFooter">
                                    <span className="orderTime">
                                        {new Date(pedido.criadoEm?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    
                                    <div className="actionArea">
                                        {pedido.status === 'pendente' && (
                                            <button className="btnAction btnPreparar" onClick={() => alterarStatus(pedido.id, 'preparando')}>
                                                PREPARAR
                                            </button>
                                        )}
                                        {pedido.status === 'preparando' && (
                                            <button className="btnAction btnPronto" onClick={() => alterarStatus(pedido.id, 'pronto')}>
                                                PRONTO
                                            </button>
                                        )}
                                        {pedido.status === 'pronto' && (
                                            <button className="btnAction btnEntregar" onClick={() => alterarStatus(pedido.id, 'entregue')}>
                                                ENTREGAR
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
// Importa o React e hooks para estados e efeitos
import React, { useState, useEffect } from 'react';
// Importa o pacote de ícones padronizado
import { Ionicons } from '@expo/vector-icons';
// Importa o roteador para navegação entre as telas
import { useRouter } from 'expo-router';
// Importa componentes visuais básicos do React Native
import { Image, ActivityIndicator } from 'react-native';

// Importa funções do Firebase Firestore para lidar com o banco de dados em tempo real
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
// Importa a instância ativa e pré-configurada do nosso Firestore
import { db } from '../../../src/config/firebase';

// Importa o arquivo CSS exclusivo desta tela
import './pedidos.css';

// Constante que define as categorias de filtro das abas disponíveis
const STATUS_LIST = ['Todos', 'Novos', 'Preparando', 'Prontos', 'Entregues'];

// Função principal que exporta a Tela de Pedidos (KDS - Kitchen Display System)
export default function PedidosScreen() {
    // Inicializa o hook de navegação
    const router = useRouter();
    // Cria estado para rastrear qual aba de filtro está selecionada
    const [activeTab, setActiveTab] = useState('Todos');
    // Cria estado para armazenar a matriz de pedidos recebidos do Firebase
    const [pedidos, setPedidos] = useState([]);
    // Cria estado de controle para mostrar o spinner de carregamento inicial
    const [loading, setLoading] = useState(true);

    // 1. Hook de Efeito que escuta os pedidos do Firebase em tempo real
    useEffect(() => {
        // Monta a consulta de pesquisa pedindo todos os itens da coleção "pedidos" ordenados por data
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'desc'));
        
        // Abre um "Ouvinte" (Websocket) contínuo do Firebase (onSnapshot) que atualiza automaticamente
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Mapeia o resultado bruto do banco para um array de objetos Javascript puros
            const lista = snapshot.docs.map(doc => ({
                id: doc.id, // Pega o identificador de chave primária do Documento (Doc ID)
                ...doc.data() // Pega todos os demais parâmetros espalhando as propriedades
            }));
            // Salva a lista convertida no estado
            setPedidos(lista);
            // Avisa que o carregamento terminou e esconde o ícone de Loading
            setLoading(false);
        });

        // Retorna a função de limpeza (Garante que vai fechar o ouvinte ao sair da tela)
        return () => unsubscribe();
    }, []); // Array de dependência vazio faz com que execute apenas 1x ao entrar na tela

    // 2. Altera o status do pedido no Banco de Dados
    const alterarStatus = async (pedidoId, novoStatus) => {
        try {
            // Aponta exatamente qual documento atualizará via Referência
            const pedidoRef = doc(db, 'pedidos', pedidoId);
            // Dispara um patch/update enviando penas o campo que quero alterar (status)
            await updateDoc(pedidoRef, { status: novoStatus });
        } catch (error) {
            // Registra erro em console e sinaliza ao usuário
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar o pedido.");
        }
    };

    // 3. Processamento local puramente lógico: Filtro de Abas
    const pedidosFiltrados = pedidos.filter(p => {
        // Se a aba for 'Todos', nenhum item é excluído da tela
        if (activeTab === 'Todos') return true;
        // Se for Novos, retorna apenas os de status 'pendente' base
        if (activeTab === 'Novos') return p.status === 'pendente';
        // Se for Preparando, retorna apenas os em preparação
        if (activeTab === 'Preparando') return p.status === 'preparando';
        // Se for Prontos, filtra e retorna os já prontos
        if (activeTab === 'Prontos') return p.status === 'pronto';
        // Se for Entregues, filtra os terminados
        if (activeTab === 'Entregues') return p.status === 'entregue';
        
        // Retorno de segurança
        return true;
    });

    // Renderiza a interface da KDS
    return (
        // Contêiner Mestre da Tela
        <div className="kdsContainer">
            {/* Header fixo no Topo */}
            <header className="kdsHeader">
                {/* Botão para Retornar usando o histórico de rotas */}
                <button className="backBtn" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                {/* Centro do Cabeçalho com Logo e Título */}
                <div className="headerCenter">
                    <Image 
                        source={require('../../../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                    <span className="kdsSubtitle">Painel da Cozinha</span>
                </div>
                {/* Divisória fantasma criando contrapeso pro flex-spacebetween ficar centralizado */}
                <div style={{ width: 40 }}></div>
            </header>

            {/* Abas de Filtro de Categoria Horizontais */}
            <div className="tabBar">
                {/* Laço de repetição que cria as abas a partir da constante STATUS_LIST declarada no topo */}
                {STATUS_LIST.map((tab) => (
                    <button 
                        key={tab} // Chave de otimização exigida pelo React
                        // Se for a aba ativa injeta um CSS extra pra pinta-la de cor de destaque
                        className={`tabItem ${activeTab === tab ? 'tabActive' : ''}`}
                        onClick={() => setActiveTab(tab)} // Altera o estado dinâmico da tela
                    >
                        {tab} {/* Exibe o texto da aba */}
                    </button>
                ))}
            </div>

            {/* Conteúdo Principal onde os blocos dos pedidos renderizam */}
            <main className="kdsContent">
                {/* Exibição condicional verificando se os Websockets carregaram */}
                {loading ? (
                    // Se não carregou exibe aviso giratório
                    <div className="centerInfo">
                        <ActivityIndicator size="large" color="#E33E42" />
                        <p>Sincronizando pedidos...</p>
                    </div>
                // Se já carregou mas houver erro ou array vazio (length 0) 
                ) : pedidosFiltrados.length === 0 ? (
                    <div className="centerInfo">
                        <Ionicons name="restaurant-outline" size={60} color="#DDD" />
                        <p>Nenhum pedido encontrado.</p>
                    </div>
                // Se array for maior de 0 renderiza o GRID Real com os blocos
                ) : (
                    <div className="ordersGrid">
                        {/* Laço de repetição (map) iterando por cada pedido e injetando na view HTML */}
                        {pedidosFiltrados.map((pedido) => (
                            // Bloco Unitário visual do Pedido, injetando CSS condicional basedo no campo Firebase 'status'
                            <div key={pedido.id} className={`orderCard status-${pedido.status}`}>
                                {/* Cabecalho do bloquinho com n. pedido e mesa */}
                                <div className="cardHeader">
                                    <div className="orderInfo">
                                        {/* Corta o imenso hash ID Firebase pras primeiras 4 letras agindo de 'senha do pedido' via .substring(0,4) */}
                                        <span className="orderCode">#{pedido.id.substring(0, 4).toUpperCase()}</span>
                                        <span className="orderMesa">Mesa {pedido.mesa}</span>
                                    </div>
                                    {/* Etiqueta colorida usando classe dinamica do status do BD */}
                                    <span className={`badgeStatus badge-${pedido.status}`}>
                                        {/* Tradução textual condicional */}
                                        {pedido.status === 'pendente' ? 'Novo' : pedido.status}
                                    </span>
                                </div>

                                {/* Corpo principal onde iteramos outra vez a matriz interna 'itens do carrinho' deste pedido em cascata */}
                                <div className="cardBody">
                                    {pedido.itens.map((item, idx) => (
                                        <div key={idx} className="orderItem">
                                            {/* Quantidade escolhida no carrinho */}
                                            <span className="itemQty">{item.quantity}x</span>
                                            {/* Nome salvo do Produto para este item */}
                                            <span className="itemName">{item.title || item.nome}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Rodapé do cartao e controles */}
                                <div className="cardFooter">
                                    {/* Conversor de ISO Date do Firestore para Hr:mm Legível aos humanos formatado padrao local */}
                                    <span className="orderTime">
                                        {new Date(pedido.criadoEm?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    
                                    {/* Botões Acionadores C.R.u.D (Updates) do Status que mudam cores dependendo da etapa (Pipeline) */}
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
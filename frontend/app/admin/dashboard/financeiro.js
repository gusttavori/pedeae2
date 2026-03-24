// Importa bibliotecas vitais para gerenciamento de interfaces reativas
import React, { useState, useEffect } from 'react';
// Importação direta dos icones unificados via @EXPO
import { Ionicons } from '@expo/vector-icons';
// Importador encarregado pelo expo-router do estado da navegação
import { useRouter } from 'expo-router';
// Importa componentes UI padrão disponíveis apenas pelo react-native engine
import { ActivityIndicator, Image } from 'react-native';

// Pacotão nativo modular do SDK Firebase engarregado das consultas (Queries) No-SQL e Websockets em Tempo Real (Snapshot)
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
// Objeto que detém as credenciais pre-validadas do projeto para os Emuladores/Produção
import { db } from '../../../src/config/firebase';

// Vinculação específica das regras CSS referentes apenas ao layout desta tela
import './financeiro.css';

// Função exportável por padrão configurando a Página do Resumo Fiscal / Gráficos de Vendas
export default function FinanceiroScreen() {
    // Instanciação em hook do utilitário push/replace/back stack navigation
    const router = useRouter();
    
    // Configuta as variáveis dinâmicas em Javascript Puro calculando strings para Formatos ISO Datas Exatas
    // 'Pega o momento corrente de hoje em modelo Dia'
    const hoje = new Date().toISOString().split('T')[0];
    // Retrocede temporalmente os calculos matemáticos subtraindo ms equivalentes a 7 Dias para retroativo
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Conjunto de Estados hook para manter as datas balizadoras e refazimento de querys condicionais
    const [dataInicio, setDataInicio] = useState(seteDiasAtras);
    const [dataFim, setDataFim] = useState(hoje);
    
    // Switch de controle para os UI blockers spinners mostrando que as chamadas websockets Firestore demoram Ms.
    const [loading, setLoading] = useState(true);
    // Estrutura array que recebe os lotes tratados das documentações pedidas puras após agrupamentos
    const [dadosProcessados, setDadosProcessados] = useState([]);
    
    // Estrutura Object para acúmulo das métricas calculadas unitárias KPI (Receitas Maximas e Médias)
    const [resumo, setResumo] = useState({ totalReceita: 0, totalPedidos: 0, ticketMedio: 0 });

    // Observador React de Ciclo de Vida do Render. É recarregado sempre que as datas de corte alterarem.
    useEffect(() => {
        // Indica começo dos processos travamento a UI para não causar falsas contagens
        setLoading(true);
        // Gera um espelho ou requisição lógica da Coleção 'pedidos' exigindo indexação ascendente ordenando data base
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'asc'));

        // Dispara uma conexão permanente bidirecional e fica aguardando envios
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Varre o lote do Database (Documentos Firebase) formatando uma nova conversão do TimeStamp pra manipulação simples textual
            const pedidosRaw = snapshot.docs.map(doc => ({
                ...doc.data(), // Explode todas the properties antigas ao invés de codá-las hard
                // Insere campo fake recodificando a Timestamp complexo Cloud Firestore nativa ao layout YYYY-MM-DD
                dataFormatada: new Date(doc.data().criadoEm?.seconds * 1000).toISOString().split('T')[0]
            }));

            // Engatilha calculos complexos sobre o array massivo e libera e UI pós tudo carregado na memória cache
            processarDados(pedidosRaw);
            setLoading(false);
        });

        // Limpador do lixo para impedir conexões duplas quando páginas viram background process.
        return () => unsubscribe();
    }, [dataInicio, dataFim]); // Hooks das dependência trigger para forçarem os recalls Reacting Effects 

    // O algorítimo encarregado pela filtragem final da memória pura gerando informações cruas as Views (Separa Dados da Tela)
    const processarDados = (pedidos) => {
        // Exclui via ArrowFunctions Filter tudo que ultrapassa/antecede o corte de data (Maior/Menor/Igual) ISO
        const filtrados = pedidos.filter(p => p.dataFormatada >= dataInicio && p.dataFormatada <= dataFim);
        
        // Memória ram agrupada em dicionário JS Hash Table puro indexando pelos Dias
        const agrupado = {};
        // Memória ram numérica base das Receitas Absolutas de Todo período
        let receitaT = 0;

        // Varrerá individualmente os elementos aprovados para as consolidações. Array Loop Iterator.
        filtrados.forEach(p => {
            // Conversor bruto "YYYY-MM-DD" quebra Array -> Reverte Data -> Pega DD e MM -> Junta com / ficando "DD/MM" (DiaMes Pt_BT)
            const data = p.dataFormatada.split('-').reverse().slice(0, 2).join('/');
            
            // Avaliador para Injetar o campo no Dicionário pra ele parar de ser Undefined e aguentar soma ++ (+=) sem gerar Null Pointer Exceptions
            if (!agrupado[data]) {
                agrupado[data] = { receita: 0, pedidos: 0, dia: data };
            }
            // Realiza incremento lógico castando (Number conversion guarantee) aos acumuladores de Vendas (Money)
            agrupado[data].receita += Number(p.total);
            // Realiza incremento quantitativo da volume dos docs count (1+1+)
            agrupado[data].pedidos += 1;
            // Realiza incremento as totais de todos os Dias num loop global de receitas consolidadas
            receitaT += Number(p.total);
        });

        // Achata o objeto Hash agrupado pra de volta se tornar um Puto Array iterável aos grids e Maps React List UI Components
        const listaFinal = Object.values(agrupado);
        
        // Joga pro Estado Principal que manda redenrizar telas esse array amassado
        setDadosProcessados(listaFinal);
        
        // Ajusta as métricas matemáticas globais e se protege via Ternário DivZero Infinito Not-A-Number Errors validando caso Filtragem for vazia
        setResumo({
            totalReceita: receitaT,
            totalPedidos: filtrados.length,
            ticketMedio: filtrados.length > 0 ? receitaT / filtrados.length : 0
        });
    };

    // Cálculos de Flexbox Base 100 Puros achando os Mágicos Tetos (Limits) - O maior fator comparado ao Resto vira divisor base teto do Style Height Inline Percentage Mapping 
    const maxReceita = Math.max(...dadosProcessados.map(d => d.receita), 1);
    const maxPedidos = Math.max(...dadosProcessados.map(d => d.pedidos), 1);

    // O que aparecerá de Interface pro Admin
    return (
        <div className="finContainer">
            {/* Header com flexões laterais (Header Top App Bar Layout Pattern Mobile) */}
            <header className="finHeader">
                <button className="backBtn" onClick={() => router.back()}>
                    {/* Botão padronizado Ionicons Dark */}
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                <div className="headerInfo">
                    <span className="finTitle">Financeiro</span>
                </div>
                {/* Spacer invisão que compensa os paddings para a título ficar exatamente centralizada no flex-space-between */}
                <div style={{ width: 40 }}></div>
            </header>

            {/* Painel dedicado isolado para manipular datas Inicio/Fim nativas do Html <input type"date" /> */}
            <section className="filterSection">
                <div className="dateInputGroup">
                    <div className="field">
                        <label>Início</label>
                        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Fim</label>
                        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                    </div>
                </div>
            </section>

            {/* A Grid Principal responsiva acomodando os Grandes Blocos Informativos Principais Superiores - Cartelas Unitárias - KPIs Views */}
            <section className="summaryGrid">
                {/* Cartão de Exibição das Receitas e faturamentos */}
                <div className="sumCard">
                    <span className="sumLabel">Receita Total</span>
                    {/* Pega float nativo formata para Casas Decimais (toFixed 2) e manipula textualmente subindo as Vírgulas ao invez dos Dot Pattern US */}
                    <span className="sumValue">R$ {resumo.totalReceita.toFixed(2).replace('.', ',')}</span>
                </div>
                {/* Cartão Exibição contagem tickets Volume Bruto (Quantos Pedidos Totais Existiram Exatos) */}
                <div className="sumCard">
                    <span className="sumLabel">Pedidos</span>
                    <span className="sumValue">{resumo.totalPedidos}</span>
                </div>
                {/* Cartão Informativo cruzamento de dados Volume * Ganho Total Médio Geral Ticket Mídia Mínimo Estimada */}
                <div className="sumCard">
                    <span className="sumLabel">Ticket Médio</span>
                    <span className="sumValue">R$ {resumo.ticketMedio.toFixed(2).replace('.', ',')}</span>
                </div>
            </section>

            {/* Macro-renderização dependente Condicional React - Exibe Gráficos se Loaded - Se não só animação */}
            {loading ? (
                // Spin area carregando com cor do laranjão theme
                <div className="loaderArea"><ActivityIndicator size="large" color="#FF8C00" /></div>
            ) : (
                // Contêiner principal e maior pros Canvas de Bars CSS custom charts puros 
                <main className="chartsArea">
                    
                    {/* Agrupamento Caixa do Relatório Vertical Barras CSS Exemplo (Faturamento e Dinheiro) Dia x Dia Histórico */}
                    <div className="chartCard">
                        <h3>Faturamento por Dia</h3>
                        <div className="chartCanvas">
                            {/* Um Mapa (Iterativo For Loop) espalhando Divs HTML em Arrays de Pilares - Cada dia equivale a 1 wrapper */}
                            {dadosProcessados.map((d, i) => (
                                <div key={i} className="barWrapper">
                                    <div className="barLabel">R${Math.round(d.receita)}</div>
                                    {/* MÁGICA: A altura de cada coluna (bar height %) equivale as variáveis maxes em regras da 3 com dados brutos correntes gerando Gráfico orgânico CSS inline styles */}
                                    <div className="bar" style={{ height: `${(d.receita / maxReceita) * 100}%` }}></div>
                                    <span className="barDate">{d.dia}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agrupamento Caixa do Relatório Vertical para Visualização puramente Quantitativas Unitária (Quantidade Em Vez de Grana) */}
                    <div className="chartCard">
                        <h3>Volume de Pedidos</h3>
                        <div className="chartCanvas">
                            {dadosProcessados.map((d, i) => (
                                <div key={i} className="barWrapper">
                                    <div className="barLabel">{d.pedidos}</div>
                                    <div className="bar barPedidos" style={{ height: `${(d.pedidos / maxPedidos) * 100}%` }}></div>
                                    <span className="barDate">{d.dia}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}
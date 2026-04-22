import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Ferramentas do Firebase para buscar dados em tempo real
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../src/config/firebase';

// Importa a folha de estilos nativa
import { styles } from './FinanceiroScreen.styles';

export default function FinanceiroScreen() {
    const router = useRouter();
    
    // --- CONFIGURAÇÃO DE DATAS PADRÃO ---
    // Pega a data de hoje e formata para o padrão internacional "YYYY-MM-DD" (ideal para filtragem e inputs)
    const hoje = new Date().toISOString().split('T')[0];
    // Calcula exatamente 7 dias atrás subtraindo os milissegundos correspondentes a uma semana
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // --- ESTADOS DO FILTRO DE DATAS ---
    const [dataInicio, setDataInicio] = useState(seteDiasAtras); // Por padrão, mostra os últimos 7 dias
    const [dataFim, setDataFim] = useState(hoje);
    
    // --- ESTADOS DA TELA ---
    const [loading, setLoading] = useState(true); // Controla o "giragira" de carregamento
    const [dadosProcessados, setDadosProcessados] = useState([]); // Guarda os dados já formatados para os gráficos
    const [resumo, setResumo] = useState({ totalReceita: 0, totalPedidos: 0, ticketMedio: 0 }); // Guarda os totais dos cards superiores

    // --- BUSCA DE DADOS EM TEMPO REAL (FIREBASE) ---
    useEffect(() => {
        setLoading(true);
        // Cria a consulta: busca na coleção 'pedidos', ordenando do mais antigo para o mais novo
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'asc'));

        // onSnapshot "escuta" o banco. Se entrar um pedido novo agora, a tela atualiza sozinha!
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Mapeia os documentos brutos do Firebase para um formato mais fácil de trabalhar
            const pedidosRaw = snapshot.docs.map(doc => ({
                ...doc.data(), 
                // O Firebase guarda a data em "seconds". Aqui convertemos de volta para o formato "YYYY-MM-DD"
                dataFormatada: new Date(doc.data().criadoEm?.seconds * 1000).toISOString().split('T')[0]
            }));

            // Manda os dados brutos para a nossa função que vai fazer a matemática
            processarDados(pedidosRaw);
            setLoading(false); // Terminou de calcular, esconde o carregamento
        });

        // Limpa a "escuta" do Firebase quando o usuário sai da tela, economizando memória e leitura de banco
        return () => unsubscribe();
    }, [dataInicio, dataFim]); // Se o usuário mudar as datas de Início ou Fim, o useEffect roda de novo

    /**
     * Função responsável por filtrar os pedidos e calcular os totais
     */
    const processarDados = (pedidos) => {
        // 1. Filtra apenas os pedidos que estão dentro do período escolhido no topo da tela
        const filtrados = pedidos.filter(p => p.dataFormatada >= dataInicio && p.dataFormatada <= dataFim);
        
        const agrupado = {};
        let receitaT = 0;

        // 2. Agrupa os pedidos dia a dia para podermos montar as barras do gráfico
        filtrados.forEach(p => {
            // Pega "2026-04-22" e transforma em "22/04" para ficar bonito no gráfico
            const data = p.dataFormatada.split('-').reverse().slice(0, 2).join('/');
            
            // Se esse dia ainda não existe no nosso objeto agrupado, cria ele zerado
            if (!agrupado[data]) {
                agrupado[data] = { receita: 0, pedidos: 0, dia: data };
            }
            
            // Soma o valor do pedido na receita daquele dia específico
            agrupado[data].receita += Number(p.total);
            // Conta +1 pedido naquele dia
            agrupado[data].pedidos += 1;
            
            // Soma também na receita global (Total do período)
            receitaT += Number(p.total);
        });

        // Transforma o objeto de volta em um array (lista) para o React conseguir desenhar na tela (map)
        const listaFinal = Object.values(agrupado);
        setDadosProcessados(listaFinal);
        
        // 3. Atualiza os cartões de resumo lá no topo
        setResumo({
            totalReceita: receitaT,
            totalPedidos: filtrados.length,
            // Ticket Médio: Quanto em média cada cliente gastou? (Evita divisão por zero se não tiver pedidos)
            ticketMedio: filtrados.length > 0 ? receitaT / filtrados.length : 0
        });
    };

    // --- CÁLCULO DE PROPORÇÃO PARA OS GRÁFICOS ---
    // Encontra o dia que mais vendeu (em R$) para ele ser a barra de 100% de altura. O ', 1' no final evita barra quebrar se for 0.
    const maxReceita = Math.max(...dadosProcessados.map(d => d.receita), 1);
    // Encontra o dia com mais volume de pedidos para ser a barra de 100% de altura no segundo gráfico
    const maxPedidos = Math.max(...dadosProcessados.map(d => d.pedidos), 1);

    return (
        <View style={styles.finContainer}>
            {/* CABEÇALHO */}
            <View style={styles.finHeader}>
                <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.finTitle}>Financeiro</Text>
                </View>
                <View style={{ width: 40 }}></View> {/* Bloco vazio para forçar o título a ficar centralizado */}
            </View>

            {/* SEÇÃO DE FILTROS DE DATA */}
            <View style={styles.filterSection}>
                <View style={styles.dateInputGroup}>
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Início</Text>
                        <TextInput 
                            style={styles.input}
                            value={dataInicio} 
                            onChangeText={setDataInicio}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numeric" // Facilita a digitação da data pelo celular
                        />
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Fim</Text>
                        <TextInput 
                            style={styles.input}
                            value={dataFim} 
                            onChangeText={setDataFim}
                            placeholder="YYYY-MM-DD"
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            {/* CARTÕES DE RESUMO (KPIs) */}
            <View style={styles.summaryGrid}>
                <View style={styles.sumCard}>
                    <Text style={styles.sumLabel}>Receita Total</Text>
                    {/* toFixed(2) garante 2 casas decimais, replace troca o ponto por vírgula para o padrão BR */}
                    <Text style={styles.sumValue}>R$ {resumo.totalReceita.toFixed(2).replace('.', ',')}</Text>
                </View>
                <View style={styles.sumCard}>
                    <Text style={styles.sumLabel}>Pedidos</Text>
                    <Text style={styles.sumValue}>{resumo.totalPedidos}</Text>
                </View>
                <View style={styles.sumCard}>
                    <Text style={styles.sumLabel}>Ticket Médio</Text>
                    <Text style={styles.sumValue}>R$ {resumo.ticketMedio.toFixed(2).replace('.', ',')}</Text>
                </View>
            </View>

            {/* ÁREA DOS GRÁFICOS (Com Scroll para não espremer a tela em celulares pequenos) */}
            <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
                {loading ? (
                    // Tela de carregamento enquanto busca os dados
                    <View style={styles.loaderArea}>
                        <ActivityIndicator size="large" color="#FF8C00" />
                    </View>
                ) : (
                    <View style={styles.chartsArea}>
                        
                        {/* GRÁFICO 1: FATURAMENTO (R$) POR DIA */}
                        <View style={styles.chartCard}>
                            <Text style={styles.chartCardTitle}>Faturamento por Dia</Text>
                            <View style={styles.chartCanvas}>
                                {dadosProcessados.map((d, i) => (
                                    <View key={i} style={styles.barWrapper}>
                                        <Text style={styles.barLabel}>R${Math.round(d.receita)}</Text>
                                        {/* MÁGICA AQUI: A altura da barra é calculada dinamicamente via porcentagem (ex: 75%) baseado no dia de maior venda (maxReceita) */}
                                        <View style={[styles.bar, { height: `${(d.receita / maxReceita) * 100}%` }]}></View>
                                        <Text style={styles.barDate}>{d.dia}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* GRÁFICO 2: VOLUME DE PEDIDOS (Qtd) POR DIA */}
                        <View style={styles.chartCard}>
                            <Text style={styles.chartCardTitle}>Volume de Pedidos</Text>
                            <View style={styles.chartCanvas}>
                                {dadosProcessados.map((d, i) => (
                                    <View key={i} style={styles.barWrapper}>
                                        <Text style={[styles.barLabel, styles.barLabelPedidos]}>{d.pedidos}</Text>
                                        {/* Mesma lógica de altura, mas agora comparando com o maxPedidos. Estilo 'barPedidos' muda a cor para escuro. */}
                                        <View style={[styles.bar, styles.barPedidos, { height: `${(d.pedidos / maxPedidos) * 100}%` }]}></View>
                                        <Text style={styles.barDate}>{d.dia}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    </View>
                )}
            </ScrollView>
        </View>
    );
}
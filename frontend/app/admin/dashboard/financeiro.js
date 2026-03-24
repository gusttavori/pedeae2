import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image } from 'react-native';

// Firebase
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../src/config/firebase';

// CSS
import './financeiro.css';

export default function FinanceiroScreen() {
    const router = useRouter();
    
    // Estados para Filtro (Padrão: últimos 7 dias)
    const hoje = new Date().toISOString().split('T')[0];
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [dataInicio, setDataInicio] = useState(seteDiasAtras);
    const [dataFim, setDataFim] = useState(hoje);
    const [loading, setLoading] = useState(true);
    const [dadosProcessados, setDadosProcessados] = useState([]);
    const [resumo, setResumo] = useState({ totalReceita: 0, totalPedidos: 0, ticketMedio: 0 });

    useEffect(() => {
        setLoading(true);
        // Busca todos os pedidos para processar o intervalo via JS 
        // (Mais flexível para gráficos dinâmicos)
        const q = query(collection(db, 'pedidos'), orderBy('criadoEm', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const pedidosRaw = snapshot.docs.map(doc => ({
                ...doc.data(),
                dataFormatada: new Date(doc.data().criadoEm?.seconds * 1000).toISOString().split('T')[0]
            }));

            processarDados(pedidosRaw);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dataInicio, dataFim]);

    const processarDados = (pedidos) => {
        const filtrados = pedidos.filter(p => p.dataFormatada >= dataInicio && p.dataFormatada <= dataFim);
        
        const agrupado = {};
        let receitaT = 0;

        filtrados.forEach(p => {
            const data = p.dataFormatada.split('-').reverse().slice(0, 2).join('/'); // Formato DD/MM
            if (!agrupado[data]) {
                agrupado[data] = { receita: 0, pedidos: 0, dia: data };
            }
            agrupado[data].receita += Number(p.total);
            agrupado[data].pedidos += 1;
            receitaT += Number(p.total);
        });

        const listaFinal = Object.values(agrupado);
        setDadosProcessados(listaFinal);
        setResumo({
            totalReceita: receitaT,
            totalPedidos: filtrados.length,
            ticketMedio: filtrados.length > 0 ? receitaT / filtrados.length : 0
        });
    };

    // Cálculo de altura das barras (escala 0 a 100)
    const maxReceita = Math.max(...dadosProcessados.map(d => d.receita), 1);
    const maxPedidos = Math.max(...dadosProcessados.map(d => d.pedidos), 1);

    return (
        <div className="finContainer">
            {/* Header */}
            <header className="finHeader">
                <button className="backBtn" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                <div className="headerInfo">
                    <span className="finTitle">Financeiro</span>
                </div>
                <div style={{ width: 40 }}></div>
            </header>

            {/* Filtros de Data */}
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

            {/* Cards de Resumo */}
            <section className="summaryGrid">
                <div className="sumCard">
                    <span className="sumLabel">Receita Total</span>
                    <span className="sumValue">R$ {resumo.totalReceita.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="sumCard">
                    <span className="sumLabel">Pedidos</span>
                    <span className="sumValue">{resumo.totalPedidos}</span>
                </div>
                <div className="sumCard">
                    <span className="sumLabel">Ticket Médio</span>
                    <span className="sumValue">R$ {resumo.ticketMedio.toFixed(2).replace('.', ',')}</span>
                </div>
            </section>

            {loading ? (
                <div className="loaderArea"><ActivityIndicator size="large" color="#FF8C00" /></div>
            ) : (
                <main className="chartsArea">
                    {/* Gráfico de Receita */}
                    <div className="chartCard">
                        <h3>Faturamento por Dia</h3>
                        <div className="chartCanvas">
                            {dadosProcessados.map((d, i) => (
                                <div key={i} className="barWrapper">
                                    <div className="barLabel">R${Math.round(d.receita)}</div>
                                    <div className="bar" style={{ height: `${(d.receita / maxReceita) * 100}%` }}></div>
                                    <span className="barDate">{d.dia}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gráfico de Pedidos */}
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
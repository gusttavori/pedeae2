// Importa bibliotecas essenciais React Native e de UI
import React, { useState } from 'react';
// Importação dos compnentes Alert, Loading Spinners do sistema Mobile Nativo e das Imagens.
import { Image, ActivityIndicator, Alert } from 'react-native';
// Vetor Icon Pack customizáveis Expo
import { Ionicons } from '@expo/vector-icons';
// SDK Auxiliar do File Router manipulando Pilha de telas
import { useRouter } from 'expo-router';
// Importação modular das interações primitivas do Google Fire Store Banco Dados
import { collection, addDoc } from 'firebase/firestore';
// Requer Instância/Objeto persistido conectado e autorizado Config Base
import { db } from '../src/config/firebase';
// Consumação do Reducer Cart de Hooks Prop Context Globais Data API
import { useCart } from '../src/context/CartContext';
// Assossiação explicita e única da Camada Styles para View (Separação Lógica CSS View CSS)
import './confirmacao.css';

// Constante que Exporta Render Default a Screen de Identificação e Geração Ticket
export default function ConfirmacaoScreen() {
    // Declaradores das váriaveis e chamadores utilitários React
    const router = useRouter();
    // Exigência Context API, destruindo variáveis em Array e Metódos para simplificar uso
    const { items: cart = [], cartTotal, clearCart } = useCart();
    
    // Status visualizando Spinner Async Awaiting Firebase Requests
    const [enviando, setEnviando] = useState(false);
    // Variavel fundamental onde armazenamos as digitações Html Numéricas Input 
    const [mesa, setMesa] = useState('');

    // Metodo Assíncrono Invocado de Submeter "Form" de Pedido ao Backend Firebase Cloud Firestore Pedidos Collection 
    const finalizarPedido = async () => {
        // Validation Front End Layer: Travar Request se Variáveis Required MESA não constar no React State
        if (!mesa) {
            // Nativo UI Alerta Alert() pra Intercept Mobile User
            alert('Por favor, informe o número da sua mesa.');
            return; // Exit point do Metodo (Encerra o Scopo local impedindo AddDOC).
        }
        // Aprova etapa e Trava Botões a UI girando um loader via state change
        setEnviando(true);

        // Bloco Protetor Isolando Call Network Firestore Try (Tenta), Catch (se Error Intercepta Falhas sem Travar o Javascript Main Thread Error)
        try {
            // Executa Post Requisição assincrona a sub-coleções no NoSQL e aguarda Promise Data Resposta Finalizar (AWaiT)
            // Enviando o pedido para a coleção 'pedidos' no Firebase 
            await addDoc(collection(db, 'pedidos'), {
                itens: cart, // Passa matriz exata limpa já contendo Id, Qnts, Titles e Prices vinda do reducer contexto
                total: cartTotal, // Valor Flutuante (Somatória total de Array Number Elements CartTotal Value)
                mesa: mesa, // Value input Type Text String (Número Referencial da View)
                status: 'pendente', // Atribuição Categórica default Início de Pipeline KDS do Firebase (Padrão Hardcoded string)
                criadoEm: new Date() // Gerador TimeStamp exato para conversões e Sorting do Backend Timestamping Query Functions Cloud Functions e Filtro Admin Dashboard
            });

            // Metódo Action do Contexto Reducers dispararando "EMPTY_CART". Destroindo Ram Volatil de States Carts Array Items Reset (Zero)
            // Limpa o carrinho após o sucesso 
            clearCart();
            
            // UI Sucess Message User Notify Layer via Device OS SDK default function caller Alert.alert(title, msg)
            // Feedback de sucesso 
            alert('Pedido enviado com sucesso para a cozinha! 🎉');
            
            // Stack Flush, Expulção Pilha das Memória de Históricos pra Redirecionar Rotas sem possibilitar "Back Buttons" voltar à tela de finalização
            router.replace('/'); // Volta para a Home limpando a pilha de navegação  (Manda do Componente Main /tabs index.tsx app Entrypoint)

        } catch (error) {
            // Captura erros silenciosos de Connection ou Timeout Request Firestore Promises Fails / Permissões Firebase Security Rules Errors (Logs no Background Server ou Dev Console Terminal Metro / Chrome DevTools V8 Engine console Error Logger System
            console.error("Erro ao enviar pedido:", error);
            alert('Erro ao enviar pedido. Tente novamente.'); // Resposta de FrontEnd para Interface View Notify do falhadamento. Fallback message padrão User Experience Design.  (Natvia Alerta Simples String). Tenta Nova Call Action Button Click event.
        } finally {
            // Pós Interceptações sucesso/erro. Liberar Bloqueio Visual para Fluxos Re-Enviaveis Async/Awatiers state change (Hide Loaders/ Unblocks UI View Elements).  (False in boolean Flag States) 
            setEnviando(false);
        }
    };

    // Construção Front End VDom Renderizável Engine
    return (
        // Encapsulamento de Telas Global Box Body View Wrapper Component Flex. Main Div Root Confirmacao Layout Template CSS Block (Styles isolation strategy architecture based on Modules) Container. "Relative / Absoulte Parent Positionings" . Base Container de Flexões 
        <div className="confirmContainer">
            {/* Header Área App Top */}
            <header className="confirmHeader">
                <button className="backBtn" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                {/* Img Logo Responsiva SVG/PNG. Importa do local project Asset Paths folder via require function react native bundling e Aplica Resising Contain (Aspect Ratio Safe Keeping Dimensions Box Style) */}
                <div className="headerLogo">
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                </div>
                {/* Margins Fixes Center Alignment App Bar Space Box. Balanceamento de Grid do Flex Space-Between */}
                <div style={{ width: 40 }}></div>
            </header>

            {/* Parte Dinâmica Conteúdo Formulários */}
            <main className="confirmContent">
                {/* Card central Branco para destacar UI Forms Design System Padrao */}
                <div className="confirmCard">
                    {/* H2 HTML Tag para Seo e Readers Acessibility (Semântica Titles Header Tag Texts) */}
                    <h2 className="confirmTitle">Finalizar Pedido</h2>
                    {/* Parágrado Instrução Helper Message */}
                    <p className="confirmSubtitle">Confirme os detalhes e informe sua mesa</p>

                    {/* Divs Group Input com Estilos Margings */}
                    <div className="inputGroup">
                        <label>Número da Mesa</label>
                        <input 
                            type="number" // Set do Engine de Keyboard Nativos p/ Mostrador Numéricos Only (Limpeza) Smartphone keyboards.  (Types Html Defaults Elements Forms Tag Properties). Text/Number/Emails/Pass...
                            className="mesaInput" 
                            placeholder="Ex: 05"
                            value={mesa} // Data-Binding (Two-Ways Data Binds). Associa View element Interface Input a Memoria State Mesa consts React Hooks States Arrays. 
                            onChange={(e) => setMesa(e.target.value)} // Event Lister (Events Dispatchers onChange Input DOM Element Event Trigger). Atribui dados capturados Event Object Target Value as mutações Function state setMesa(newValue). (Hook Setters Calls Render Triggers Component React Virtual DOM update cycles.  )
                        />
                    </div>

                    {/* Visualização Simplificada Totalizadores da Data Items Cart Objects State */}
                    <div className="resumoPedido">
                        <p className="resumoTitle">Resumo dos Itens</p>
                        {/* Func Loop Iterator de Listas/Array Map Array de Items de Carrinho Context Api  (Iteração Object Javascript Mapping Functions Array). */ }
                        {cart.map((item) => (
                            // Sub Box Iteração . Key UUID/UniqueID exigência engine mapping Array Items . Flex Container de Texts.
                            <div key={item.id} className="resumoItem">
                                <span>{item.quantity}x {item.title || item.nome}</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span> {/* Inline Logic Calc Math (Qtd X Preco), Conversão String (Fixed 2 Decimais Places Numbers), e Replaces Point p/ Commas pt_BR Currency Models Formatting Formatter String Regexing Replace Patterns Formatação Valores Strings e Matematica. */} 
                            </div>
                        ))}
                        {/* Divisória Linha CSS Separa */}
                        <div className="divisor"></div>
                        
                        {/* Bloco Tota Final */}
                        <div className="resumoTotal">
                            <span>Total</span>
                            <span>R$ {Number(cartTotal).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    {/* Action Buttons Principal Bottom Call */}
                    <button 
                        className="btnFinalizar" 
                        onClick={finalizarPedido}
                        // Botão Desativado Boolean Expression Logics Control Flag Property (True / False). Loading Envios State / Ou Validation Cart Size Zero. Disable Native HTML Form Input Attrib Property Controller Boolean State Mappers. Blocks User Events dispatchings Event propagation.
                        disabled={enviando || cart.length === 0}
                    >
                        {/* Ternátório Loader View Logics */}
                        {enviando ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            "ENVIAR PARA A COZINHA"
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
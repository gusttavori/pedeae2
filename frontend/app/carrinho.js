// Importa a biblioteca base do React
import React from 'react';
// Importa o componente nativo optimizado para exibição de Imagens no celular
import { Image } from 'react-native'; 
// Importa o pacote unificado de fontes e Ícones Vetoriais
import { Ionicons } from '@expo/vector-icons';
// Inicializa o gerenciador de rotas de URLs interno do SDK Expo
import { useRouter } from 'expo-router';

// Referência ligando os estilos padronizados via classNames para esta view
import './carrinho.css';
// Requer o arquivo Contexto Global desempacotando as funções do Cart
import { useCart } from '../src/context/CartContext';

// Define e Exporta a Tela de Carrinho como módulo principal do arquivo
export default function CartScreen() {
    // Aplica a instância do Router do expo-router na const
    const router = useRouter();
    
    // Captura as lógicas e variáveis globais vindas do Context API React
    // Nota: "items: cart = []" -> Renomeia var Items pra Cart e garante que será um Array caso chegue null/undefined
    const { items: cart = [], updateQuantity, removeFromCart, cartTotal } = useCart();

    // Função Subcomponente: Renderiza os Retalhos/Listagens Individuais de 1 a N
    const renderItem = (item) => (
        // Contêiner Mestre das informações do item (necessita key UUID props para Otimização React Lists)
        <div className="cartItem" key={item.id}>
            {/* Foto referencial vinda das nuvens (Cloudinary Links ou Assets Locais dependendo do Produto) */}
            <img src={item.image} className="productImage" alt={item.nome || item.title} />
            
            {/* Bloco Meio Texto de nomes formatados */}
            <div className="productInfo">
                {/* Fallback Lógico de Texto caso BD salve Title em x produtos ou Nome em y produtos */}
                <p className="productName">{item.title || item.nome}</p> 
                {/* Máscara Monetária convertendo Numbers Float a formato humano BR */}
                <p className="productPrice">
                    R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </p>
            </div>

            {/* Grupo de Controladores Botões de Ações de Quantias e Deleção */}
            <div className="actionsContainer">
                {/* Subgrupo que alinha horizontalmente (+ , Numeros , -) */}
                <div className="quantityControl">
                    {/* Botão Botão Menos - Chamando context api para dar Decréscimo */}
                    <button
                        className="quantityBtn"
                        onClick={() => updateQuantity(item.id, 'decrement')}
                    >
                        <Ionicons name="remove" size={16} color="#FF8200" />
                    </button>

                    {/* Exibe do BD Global o contador virtual do item deste subcomponent */}
                    <span className="quantityText">{item.quantity}</span>

                    {/* Botão Botão Mais - Chamando context api para dar Acréscimo */}
                    <button
                        className="quantityBtn"
                        onClick={() => updateQuantity(item.id, 'increment')}
                    >
                        <Ionicons name="add" size={16} color="#FF8200" />
                    </button>
                </div>

                {/* Botão Lixeira - Chama função total Remove Object do state Cart Contexto */}
                <button
                    className="deleteBtn"
                    onClick={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF8200" />
                </button>
            </div>
        </div>
    );

    // O Retorno do Código de Renderização principal e Casca da Tela
    return (
        // Encerramento principal
        <div className="container">
            {/* Cabecalho Top Bar Branco Flex-Box horizontal */}
            <div className="header">
                {/* Botão com seta de seta para Voltar para o Dashboard Ou Main Menu (router.back) */}
                <button className="backButton" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#222222" />
                </button>

                {/* Subdivisão para a tipografia e Imagem da Área Central do View */}
                <div className="headerTitles">
                    {/* Logomarca de Assets carregado com o React Native em Modos Dinâmicos Baseados no Dispositivo Tela */}
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                    {/* Descritivo de Aba */}
                    <p className="headerSubtitle">Meu pedido</p>
                </div>

                {/* Compensando FlexBox Centralização com Quadrado invisível e inútil da mesma largura do Botão voltar para justificar */}
                <div style={{ width: 24 }}></div>
            </div>

            {/* Renderização Condicional da Lista de Compras (Carrinho Base) */}
            {cart.length === 0 ? (
                // Cenário "NÃO HÁ NADA AQUI (Lenght == 0)", exibindo arte Vetorial e Frases
                <div className="emptyContainer">
                    <Ionicons name="cart-outline" size={60} color="#CCC" />
                    <p className="emptyText">Seu carrinho está vazio</p>
                </div>
            ) : (
                // Cenário TUDO BEM (Itens Maiores ou iguis 1). Map percorrendo Array Context
                <div className="listContainer">
                    {/* Invoca Subfunções que criamos retornando aquele JSX para cada Registro Array Object */}
                    {cart.map((item) => renderItem(item))}
                </div>
            )}

            {/* Footer Área Renderizada de Forma Condicional (&& And). Ou Existe Valor ou Retorna Null pra Interface. Nunca Mostra Checkout sem Items*/}
            {cart.length > 0 && (
                <div className="footer">
                    {/* Mostrador Informativo Final das despesas agrupando texto Label a Valor Variável Context API*/}
                    <div className="totalContainer">
                        <span className="totalText">Total</span>
                        <span className="totalValue">
                            {/* Pega Constante Global Reducer Totalizador + Formata Valor*/}
                            R$ {Number(cartTotal).toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    {/* Botão Conclusor enviando Props pelo route Link Rediricionando aos Resumos Pagamentos e Mesas */}
                    <button
                        className="confirmButton"
                        // Empurra os States Atuais e Move View Para "checkout-confirmation"
                        onClick={() => router.push('/confirmacao')}
                    >
                        {/* Span estético padronizador do label button */}
                        <span className="confirmButtonText">
                            CONFIRMAR PEDIDO
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
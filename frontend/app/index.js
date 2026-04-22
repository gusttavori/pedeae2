// Importa a biblioteca base do React e os hooks de gerenciamento de estado e ciclo de vida
import React, { useState, useEffect } from 'react';
// Importa componentes visuais nativos otimizados para aplicativos móveis
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// Importa a biblioteca unificada de ícones vetoriais
import { Ionicons } from '@expo/vector-icons';
// Importa o sistema de navegação (roteador) do Expo
import { useRouter } from 'expo-router';
// Importa o componente que controla a cor/estilo da barra de status do celular (bateria, hora, etc.)
import { StatusBar } from 'expo-status-bar';

// Importações do Firebase para lidar com o banco de dados em tempo real
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// Importa a instância ativa e pré-configurada do banco Firestore do nosso projeto
import { db } from '../src/config/firebase';
// Importa e consome os dados globais do Carrinho de Compras através da Context API
import { useCart } from '../src/context/CartContext';

// Importa a folha de estilos exclusiva contendo as regras de CSS da tela principal
import './index.css';

// Constante que define as categorias fixas disponíveis para filtro no cardápio
const CATEGORIAS = ["Todos", "Hambúrguer", "Acompanhamentos", "Bebidas", "Sobremesas"];

// Componente principal que é exportado para renderizar a Home do Aplicativo (Página Inicial)
export default function HomeScreen() {
  // Inicializa o hook de navegação para habilitar links e transições de tela
  const router = useRouter();
  
  // Extrai o array de itens do carrinho e a função de adicionar vindos do contexto global
  const { items, addItem } = useCart();
  
  // Cria estado para armazenar a lista completa de produtos vinda do banco de dados
  const [produtos, setProdutos] = useState([]);
  // Cria estado booleano para mostrar visualmente a rodinha carregando (loading spinner)
  const [loading, setLoading] = useState(true);
  // Cria estado para armazenar a categoria do menu que o cliente clicou para filtrar
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  // Cria estado para guardar o ID de qual produto o usuário clicou para expandir (ver mais descrição)
  const [expandedId, setExpandedId] = useState(null);
  // Estado para controlar a notificação de item adicionado (Toast)
  const [showToast, setShowToast] = useState(false);

  // Hook useEffect que é executado automaticamente assim que a tela abre, buscando dados do servidor
  useEffect(() => {
    // Constrói uma query (pergunta) ao banco: Pegue a coleção 'produtos' e ordene pela data de criação decrescente
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
    
    // Abre um túnel permanente (Websocket) "onSnapshot" que escuta a tabela do banco, atualizando a tela sem recarregar F5
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Pega o punhado de documentos brutos do Firebase e "mapeia" iterando para converter em objetos Javascript padrão
      const lista = querySnapshot.docs.map(doc => ({ 
        id: doc.id, // ID Único Hash do Firestore para servir como chave primária 
        ...doc.data() // Puxa/Espalha todos os dados salvos lá (nome, preco, foto, desc...) 
      }));
      // Salva a lista convertida no Estado "produtos" do React para renderização
      setProdutos(lista);
      // Processo de carga terminou, logo tira o spinner alterando state
      setLoading(false);
    });
    
    // Esta função de retorno "Limpa" a conexão de websockets abertos caso o usuário saia desta tela, economizando memória/internet
    return () => unsubscribe();
  }, []); // Array de dependência vazio []. Isso diz ao React: "Execute esse Effect apenas 1 ÚNICA VEZ ao iniciar."

  // Lógica de manipulação de dados local em FrontEnd: Filtra os itens do catálogo
  // Se a aba ativada for "Todos", ele retorna o estado inteiro. Se não, varre o array retornando só os compatíveis
  const produtosFiltrados = categoriaAtiva === "Todos" 
    ? produtos 
    : produtos.filter(p => p.categoria === categoriaAtiva);

  // Retorna JSX - A conversão de sintaxe HTML que o React usa misturado com JS
  return (
    // Invólucro master da Página Inicial (Flexbox Container)
    <div className="homeContainer">
      {/* Força e pinta a barra de status do relógio/wifi do Android/iOS para letra preta contrastante "dark" */}
      <StatusBar style="dark" />

      {/* Seção Superior Cabeçalho */}
      <header className="homeHeader">
        <div className="headerBrandContainer">
          {/* Componente Image em vez do img clássico (garante performance de redimensionamento nativo) */}
          <Image 
            source={require('../assets/images/logo-pedeae.png')} 
            style={{ width: 120, height: 40, resizeMode: 'contain' }}
          />
        </div>

        {/* Botão interativo clicável que leva pra view/rota '/carrinho' usando o framework Router */}
        <button className="cartBtn" onClick={() => router.push('/carrinho')}>
          <Ionicons name="cart-outline" size={26} color="#333" />
          {/* Expressão Condicional: Caso haja Itens no array (> 0), ele desenha a bolinha vermelha Floating Badge */}
          {items?.length > 0 && <div className="badge">{items.length}</div>}
        </button>
      </header>

      {/* Trilha de Botões Horizontais com Scrool de Categorias */}
      <div className="categoryScroll">
        {/* Função Map que itera do array de Strings Constante (Lá no Topo) gerando os múltiplos botões por iteração */}
        {CATEGORIAS.map((cat) => (
          <button 
            key={cat} // Propiedade necessária (identificador único na DOM virtual para ajudar re-renders do React Engine)
            // Aplica classe condicional. Se A string 'categoriaAtiva' bater com a desse laço pinta ele com destaque Active
            className={`categoryItem ${categoriaAtiva === cat ? 'categoryItemActive' : ''}`}
            // Quando clica num botão de nome, atualiza o State de Controle central para recriar as Views filtradas
            onClick={() => setCategoriaAtiva(cat)}
          >
            {/* Imprimi String nome Limpo da var iterada (Ex: 'Bebidas') */}
            {cat} 
          </button>
        ))}
      </div>

      {/* Renderização principal do Corpo da Tela (Bloco Condicional) */}
      {/* Operador Ternário Analizando Processamentos: se ainda "ESTIVER LOADING (Loading == true)" */}
      {loading ? (
        // Devolve na tela esse div com texto de carregar
        <div className="center">Carregando cardápio...</div>
      ) : ( 
        // Se loading == false. Devolve o Layout do CSS Grid em Listagem e Cards
        <div className="productList">
          {/* Varre a Array Produtos que já passou pela Filtragem da Memória (Local Filtering) */}
          {produtosFiltrados.map((item) => {
            // Verifica na Tabela de Estados React se este card em Loop específico que geramos é o Atual aberto/clicado de forma Booleana
            const isExpanded = expandedId === item.id;
            return (
              // Monta a Div contendo classes condicionais que expandem para mostrar ou esconder blocos CSS textuais extra
              <div 
                className={`productCard ${isExpanded ? 'cardExpanded' : ''}`} 
                key={item.id} // ID Uníco Primary Key Exigência React.
                // Função OnClick com Operador Ternário: se já estava aberto ele envia nulo "Nenhum clicado/Fechar", senão ele Seta pra si mesmo como aberto
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Renderização base da Imagem Externa Cloudinary do item provinda pelo DB source Firebase  */}
                <img src={item.imagem} className="prodImg" alt={item.nome} />
                
                {/* Organização e Agrupamentos visuais via DIVS e Classes Block/Flex */}
                <div className="prodInfo">
                  <div>
                    <h3 className="prodTitle">{item.nome}</h3>
                    {/* Aqui o Parágro recebe Classe Dinâmica Escondendo Descrições via Display:None pra economizar Espaço Front caso a Div acima avaliou false.  */}
                    <p className={`prodDesc ${isExpanded ? 'descVisible' : 'descHidden'}`}>
                      {item.descricao}
                    </p>
                  </div>
                  {/* Sub Header de linha Price Value e Action Button Carrinho */}
                  <div className="priceRow">
                    {/* Transformadores Visuais Monetários String pt_br Money*/}
                    <span className="prodPrice">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</span>
                    {/* Invocação de Method OnClick Add Cart Buttons Acionando Funcões e Propagaçoes. */}
                    <button className="addBtn" onClick={(e) => {
                      // Impede a função bolha propagation do DOM pra que clicar E ADICIONAR não cause expansão textual descrita do card container no Background "acidentalmente" 
                      e.stopPropagation();
                      // Empurra/Envia Propiedades Chave para Função ContextReducer Hook Guardar na Memória Ram Global App do Array Carrinho
                      addItem({ id: item.id, title: item.nome, price: item.preco, image: item.imagem });
                      // Lógica do Toast
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2500);
                    }}>
                      <Ionicons name="add" size={20} color="#FFF" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Função Escondida (Secret Menu) no formato Material Design Botão Flutuante Action FAB */}
      {/* Botão Admin - Tenta direcionar link à Área Restrita mas o Gateway Middleware _layout OBRIGA que Usuários façam Login validado Firebase Auth caso n estejam autenticados nos cookies do device*/}
      <button className="adminFab" onClick={() => router.push('/admin/dashboard')}>
        <Ionicons name="lock-closed-outline" size={22} color="#FFF" /> 
      </button>

      {/* Alerta Toast Flutuante */}
      {showToast && (
        <div className="toastAlert">
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <span>Adicionado ao carrinho</span>
        </div>
      )}
    </div>
  );
}
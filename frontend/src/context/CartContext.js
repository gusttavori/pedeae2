// Importa a biblioteca React e hooks nativos da Context API para gerenciamento de estado global
import React, { createContext, useState, useContext } from 'react';

// Cria a instância do Contexto do Carrinho que funcionará como a "memória central" do app
const CartContext = createContext();

// Componente Provedor (Wrapper) que deve abraçar as rotas do aplicativo para distribuir os states
export const CartProvider = ({ children }) => {
  // Estado local do contexto: Armazena o Array de produtos adicionados (Renomeado de 'cart' para 'items')
  const [items, setItems] = useState([]);

  // Função para adicionar um novo produto ou aumentar a quantidade de um já existente
  const addItem = (product) => {
    // Acessa o estado anterior de forma funcional (prevItems) para garantir previsibilidade na atualização
    setItems((prevItems) => {
      // Procura no array se o produto escolhido já foi adicionado antes (comparando IDs)
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      // Avaliação Condicional: Se o produto já está no carrinho...
      if (existingItem) {
        // Mapeia passando por todos. Se for ele, clona o item (...item) somando +1 na quantidade (quantity)
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item // Se não for ele, devolve como estava, sem alterações
        );
      }
      
      // Se for um produto COMPLETAMENTE NOVO no carrinho:
      // Despeja/clona todo array antigo (...prev) e adiciona um objeto novo no final assegurando propriedade quantity
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // Função para remover um produto inteiramente do carrinho não importa a quantidade dele
  const removeFromCart = (productId) => {
    // Filtra o array, mantendo apenas aqueles cujo ID for DIFERENTE do id que eu pedi para remover
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Função para atualizar a quantidade (+ ou - 1 item matemático) acionada pelos controles da tela CarrinhoScreen
  const updateQuantity = (productId, type) => {
    // Acessa array anterior via Arrow Function
    setItems((prevItems) => {
      // Inicia um laço de repetição re-criando os objetos da lista
      return prevItems.map((item) => {
        // Encontra o item específico que sofreu a ação dos botões
        if (item.id === productId) {
          // Lógica booleana ternária: Se for "increment" faz +1. Se não (decrement) subtrai 1.
          const newQuantity =
            type === 'increment' ? item.quantity + 1 : item.quantity - 1;
          
          // Clona o objeto atualhando o valor numérico assegurando, por segnrança nativa (Math.max) que o limite mínimo seja SEMPRE 1. (Nunca ter item com quant 0 no array)
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        // Se a iteração map cair em um item não clicado, devolve o memo inalterado
        return item;
      });
    });
  };

  // Cálculo Monetário Geral: O Reducer junta, para cada iteração do array, as quantias da prop "price" (multiplicadas pelas qtd/quantity) acumulando no final na variável única cartTotal
  // A variável substitui funções tradicionais para evitar erros crash type NotAFunction nas views. O valor é re-calculado de forma dinâmica e leve sempre que o hook setState sofre mudança de itens.
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Metódo final de limpeza de Cache do array do carrinho (Útil para limpar a UI assim que ocorre Checkout/Finalização do pagamento perante o BD do Firebase)
  const clearCart = () => {
    // Seta array para Vazio Length 0
    setItems([]);
  };

  // Construção do componente exportável engajador HOC da Raíz.
  return (
    // Ativa a capacidade .Provider passando o dicionário (Value dict) com os estados e funções disponíveis 
    <CartContext.Provider
      value={{
        items,           // Variável de estado Array List Items Carrinho exposta aos Filhos
        addItem,         // Pointer p Metódo const Add Item para inserção acionável via buttons Home Lists Cards
        removeFromCart,  // Lixeira Função para Remoções das listagens
        updateQuantity,  // Setters Plus + Minnus Controles Array Numbers
        cartTotal,       // Const Calculável Reducer Matemática exposta já convertida Número Bruto de soma Total da Carteira
        clearCart,       // O reset zero do array states 
      }}
    >
      {/* Válvula de Escape: Aqui é onde todos os Componentes do React Native App (O resto do aplicativo_ vão entrar e ser renderizados envoltas pelas properties fornecidas nativa do Contexto) */}
      {children}
    </CartContext.Provider>
  );
};

// Facilitação (Syntatic Sugar). Exporta esse Hook Customizado pro desenvolvedor importar apenas "useCart()" ao invês de ter que chamar "useContext e passar o Contexto sempre como paramêtro".
export const useCart = () => useContext(CartContext);
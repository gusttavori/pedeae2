import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Mudamos o nome de 'cart' para 'items' para bater com as telas
  const [items, setItems] = useState([]);

  // 2. Mudamos para 'addItem' para plugar certinho com o botão da Home
  const addItem = (product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Se já existe, atualiza a quantidade
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Se é novo, adiciona garantindo que tem a propriedade quantity
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // Função para remover um produto inteiramente do carrinho
  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Função para atualizar a quantidade (+ ou -) no CarrinhoScreen
  const updateQuantity = (productId, type) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity =
            type === 'increment' ? item.quantity + 1 : item.quantity - 1;
          
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };

  // 3. Transformamos em uma variável calculada (em vez de função) 
  // Isso evita o erro de "cartTotal is not a function" na tela do Carrinho
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Limpar carrinho (útil para quando o pedido for finalizado)
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,           // Exportando como 'items'
        addItem,         // Exportando como 'addItem'
        removeFromCart,
        updateQuantity,
        cartTotal,       // Exportando como valor (número)
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
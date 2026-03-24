// Importa o React, que é a biblioteca base para construir a interface
import React from 'react';
// Importa o componente Stack do expo-router, responsável por gerenciar a navegação em pilha
import { Stack } from 'expo-router';
// Importa o provedor de contexto do carrinho para disponibilizar o estado global
import { CartProvider } from '../src/context/CartContext';

// Função principal que define o layout raiz do aplicativo
export default function RootLayout() {
  // Retorna a estrutura da interface, englobando tudo no CartProvider
  return (
    // Provedor que permite a todas as telas acessarem os dados do carrinho de compras
    <CartProvider>
      {/* O Stack gerencia as telas principais e esconde o cabeçalho padrão do celular (headerShown: false) */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Telas do Cliente - define a tela inicial ("index") */}
        <Stack.Screen name="index" />
        {/* Define a tela do carrinho de compras */}
        <Stack.Screen name="carrinho" />
        {/* Define a tela de confirmação de pedido */}
        <Stack.Screen name="confirmacao" />
        {/* Define o grupo de telas da área administrativa */}
        <Stack.Screen name="admin" />
      </Stack>
    </CartProvider>
  );
}
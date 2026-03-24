import React from 'react';
import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      {/* O Stack gerencia as telas principais e esconde o cabeçalho padrão do celular */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Telas do Cliente */}
        <Stack.Screen name="index" />
        <Stack.Screen name="carrinho" />
        <Stack.Screen name="confirmacao" />
        <Stack.Screen name="admin" />
      </Stack>
    </CartProvider>
  );
}
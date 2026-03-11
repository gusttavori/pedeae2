import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';

export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="carrinho" />
        <Stack.Screen name="confirmacao" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="gerenciar-cardapio" />
      </Stack>
    </CartProvider>
  );
}

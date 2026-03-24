// Importa o componente Tabs do expo-router para criar navegação em abas
import { Tabs } from 'expo-router';
// Importa a biblioteca React
import React from 'react';

// Importa um componente customizado para abas com feedback tátil (vibração)
import { HapticTab } from '@/components/haptic-tab';
// Importa o componente de ícones padronizado do projeto
import { IconSymbol } from '@/components/ui/icon-symbol';
// Importa as definições de cores do tema do aplicativo
import { Colors } from '@/constants/theme';
// Importa um hook para detectar se o tema atual é claro ou escuro
import { useColorScheme } from '@/hooks/use-color-scheme';

// Função que exporta o layout principal das abas
export default function TabLayout() {
  // Obtém o esquema de cores atual do sistema (claro ou escuro)
  const colorScheme = useColorScheme();

  // Retorna a estrutura de navegação em abas
  return (
    // Configura o contêiner de abas
    <Tabs
      screenOptions={{
        // Define a cor do ícone quando a aba está ativa com base no tema
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Oculta o cabeçalho superior padrão em todas as telas de abas
        headerShown: false,
        // Define o componente customizado a ser usado como botão de cada aba
        tabBarButton: HapticTab,
      }}>
      
      {/* Configura a primeira aba (Tela Inicial) */}
      <Tabs.Screen
        name="index" // Nome do arquivo associado a essa aba
        options={{
          // Título exibido na aba
          title: 'Home',
          // Função que renderiza o ícone da aba, passando a cor correta
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {/* Configura a segunda aba (Tela de Exploração) */}
      <Tabs.Screen
        name="explore" // Nome do arquivo associado a essa aba
        options={{
          // Título exibido na aba
          title: 'Explore',
          // Função que renderiza o ícone da aba de exploração
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

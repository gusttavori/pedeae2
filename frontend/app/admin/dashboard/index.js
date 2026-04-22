import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useRouter } from 'expo-router'; // Ferramenta para navegar entre as telas
import { signOut } from 'firebase/auth'; // Função do Firebase para deslogar
import { auth } from '../../../src/config/firebase'; // Instância do Firebase configurada no projeto

// Importa os estilos que comentamos logo acima
import { styles } from './AdminDashboardIndex.styles';

export default function AdminDashboardIndex() {
  // Inicializa o roteador para conseguirmos mudar de tela
  const router = useRouter();

  /**
   * Função responsável por deslogar o administrador do sistema.
   * Ela é "async" (assíncrona) porque depende da resposta da internet/Firebase.
   */
  const handleSair = async () => {
    try {
      // Tenta encerrar a sessão no Firebase
      await signOut(auth);
      console.log("Sessão encerrada com sucesso.");
      
      // router.replace remove o histórico. Assim, se o usuário clicar em "voltar" no celular, ele não volta pro painel.
      router.replace('/admin/login'); 
    } catch (error) {
      console.error("Erro ao sair:", error);
      // Se a internet cair ou o Firebase falhar, exibe um alerta nativo avisando o usuário
      Alert.alert("Erro", "Erro ao tentar sair do sistema.");
    }
  };

  /**
   * Componente reutilizável (Função Helper).
   * Em vez de copiar e colar o mesmo código visual para os 3 botões (Pedidos, Financeiro, Cardápio),
   * criamos essa função. Você passa as informações, e ela monta o botão pra você.
   */
  const renderMenuCard = (title, description, iconName, route, color) => (
    <TouchableOpacity 
      activeOpacity={0.8} // Quando clicado, a opacidade diminui levemente, dando efeito de clique
      style={styles.menuCard} 
      onPress={() => router.push(route)} // Ao clicar, navega para a rota passada como parâmetro
    >
      {/* Container do ícone: Repare no 'color + 15'. Isso pega a cor principal e adiciona '15' em Hexadecimal para criar um fundo translúcido da mesma cor do ícone! */}
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={iconName} size={32} color={color} />
      </View>
      
      {/* Textos do botão */}
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      
      {/* Setinha para a direita no final do card, indicando que é clicável */}
      <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
    </TouchableOpacity>
  );

  // --- RENDERIZAÇÃO DA TELA (O que o usuário vê) ---
  return (
    <View style={styles.dashboardContainer}>
      
      {/* BARRA SUPERIOR (HEADER) */}
      <View style={styles.dashboardHeader}>
        {/* Botão de ir para o App/Site cliente */}
        <TouchableOpacity activeOpacity={0.8} style={styles.iconBtn} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Painel de Controle</Text>
        
        {/* Botão de Sair (Executa a função handleSair) */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.iconBtn} 
          onPress={handleSair} 
          accessibilityLabel="Sair do Sistema" // Bom para acessibilidade (leitores de tela)
        >
          <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ÁREA COM ROLAGEM */}
      {/* O ScrollView é vital aqui. Se o celular for pequeno (ex: iPhone SE), os cards não vão caber na tela toda. O ScrollView permite arrastar para ver o resto. */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardContent}>
          
          {/* TEXTO DE BOAS-VINDAS */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Olá, Administrador 👋</Text>
            <Text style={styles.subtitleText}>O que você deseja gerenciar hoje?</Text>
          </View>

          {/* LISTA DE OPÇÕES DO MENU */}
          <View style={styles.menuContainer}>
            
            {/* Usa a função auxiliar para desenhar o botão de Pedidos (Vermelho) */}
            {renderMenuCard(
              "Gestão de Pedidos",
              "Acompanhe e atualize o status dos pedidos em tempo real.",
              "fast-food",
              "/admin/dashboard/pedidos",
              "#E33E42" 
            )}

            {/* Usa a função auxiliar para desenhar o botão Financeiro (Laranja) */}
            {renderMenuCard(
              "Financeiro",
              "Visualize suas receitas, gráficos e fluxo de caixa.",
              "bar-chart",
              "/admin/dashboard/financeiro",
              "#FF8C00" 
            )}

            {/* Usa a função auxiliar para desenhar o botão do Cardápio (Verde) */}
            {renderMenuCard(
              "Cardápio",
              "Adicione, edite ou remova produtos do seu catálogo.",
              "restaurant",
              "/admin/dashboard/cardapio",
              "#4CAF50" 
            )}
            
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
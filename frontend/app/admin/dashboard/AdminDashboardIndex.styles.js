import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTRUTURA GERAL ---
  // Container principal que abraça a tela inteira do App
  dashboardContainer: {
    flex: 1, // Faz o container ocupar 100% da tela disponível
    backgroundColor: '#F5F5F5', // Fundo cinza claro para destacar os cards brancos
    
    // Configurações para manter a tela bonita em dispositivos maiores (iPad ou Web)
    maxWidth: 600, // Impede que a tela estique demais em monitores grandes
    width: '100%',
    alignSelf: 'center', // Centraliza o app caso a tela seja maior que 600px
  },

  // --- CABEÇALHO (HEADER) ---
  dashboardHeader: {
    height: 75,
    backgroundColor: '#FF8C00', // Laranja vibrante para a identidade visual
    flexDirection: 'row', // Alinha os itens lado a lado (horizontalmente)
    alignItems: 'center', // Centraliza os itens verticalmente dentro do header
    justifyContent: 'space-between', // Joga um ícone pra esquerda, o texto pro meio e o outro ícone pra direita
    paddingHorizontal: 20, // Dá um respiro nas laterais para os ícones não colarem na borda
    
    // Efeitos de sombra (o React Native exige configurações diferentes para Android e iOS)
    elevation: 4, // Cria a sombra no Android
    shadowColor: '#FF8C00', // Sombra alaranjada no iOS
    shadowOffset: { width: 0, height: 4 }, // iOS: Desloca a sombra para baixo
    shadowOpacity: 0.3, // iOS: Deixa a sombra levemente transparente
    shadowRadius: 8, // iOS: Deixa a borda da sombra mais suave/esfumaçada
    zIndex: 10, // Garante que o header fique sempre "por cima" do conteúdo que rola abaixo dele
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold', // Texto em negrito para dar destaque
  },
  iconBtn: {
    padding: 5, // Aumenta a área de toque do botão para facilitar o clique do usuário
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- ÁREA DE ROLAGEM (SCROLL) ---
  scrollContent: {
    flexGrow: 1, // Permite que o conteúdo cresça e habilite a rolagem apenas se necessário
  },
  dashboardContent: {
    padding: 20, // Respiro ao redor de todo o conteúdo principal
    paddingBottom: 40, // Espaço extra no final da tela para o último card não ficar colado no rodapé
  },

  // --- MENSAGEM DE BOAS VINDAS ---
  welcomeSection: {
    marginTop: 10,
    marginBottom: 25, // Separa o texto de boas-vindas dos botões do menu
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Cinza escuro, mais suave e elegante que o preto puro (#000)
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666666', // Cinza médio para criar uma hierarquia visual com o título
  },

  // --- CARDS DO MENU (BOTÕES GRANDES) ---
  menuContainer: {
    flexDirection: 'column', // Empilha os cards um embaixo do outro
    gap: 15, // Cria um espaçamento de 15px entre cada card (sem precisar usar margin em todos eles)
  },
  menuCard: {
    flexDirection: 'row', // Ícone à esquerda, texto ao meio, setinha à direita
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fundo branco para contrastar com o fundo cinza da tela
    padding: 20,
    borderRadius: 16, // Deixa as bordas do card bem arredondadas e modernas
    
    // Sombras do card (mesma lógica do header: Android vs iOS)
    elevation: 2, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, // Sombra bem sutil no iOS, apenas para destacar o card do fundo
    shadowRadius: 5, 
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15, // Quadrado com bordas arredondadas onde o ícone fica dentro
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15, // Espaço entre o quadrado do ícone e o texto do card
  },
  menuInfo: {
    flex: 1, // Faz essa área de texto ocupar todo o espaço central disponível no card
    flexDirection: 'column',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18, // Aumenta o espaço entre as linhas do texto para facilitar a leitura
  },
});
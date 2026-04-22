import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- ESTRUTURA DA TELA ---
  kdsContainer: {
    flex: 1,
    backgroundColor: '#F4F7F6', // Um tom de cinza azulado bem leve, típico de sistemas de gestão
  },

  // --- CABEÇALHO (HEADER) ---
  kdsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center', // Centraliza o logo e o subtítulo
  },
  kdsSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase', // Deixa em caixa alta para um visual de "label"
    letterSpacing: 1, // Espaçamento entre letras para melhorar a leitura
    marginTop: 4,
  },

  // --- BARRA DE FILTROS (TABS) ---
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabBarScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10, // Espaçamento entre as bolinhas das abas
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30, // Deixa os filtros com formato de "pílula"
    backgroundColor: '#F0F0F0',
    marginRight: 10, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FF8C00', // Cor de destaque quando o filtro está selecionado
  },
  tabText: {
    color: '#666666',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF', // Texto branco para contrastar com o fundo laranja
  },

  // --- CONTEÚDO E GRID DE PEDIDOS ---
  kdsContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1, // Garante que o scroll funcione mesmo com poucos itens
  },
  ordersGrid: {
    flexDirection: 'column',
    gap: 15, // Espaçamento vertical entre os cards
  },

  // --- O CARD DO PEDIDO (TICKET) ---
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 6, // Essa borda grossa à esquerda é o segredo visual para indicar o status
    borderLeftColor: '#DDDDDD', // Cor padrão cinza
    
    // Sombras para dar efeito de elevação (profundidade)
    elevation: 4, // Android
    shadowColor: '#000000', // iOS
    shadowOffset: { width: 0, height: 4 }, // iOS
    shadowOpacity: 0.05, // iOS
    shadowRadius: 12, // iOS
  },

  // --- CORES DINÂMICAS DE STATUS ---
  // Essas classes são aplicadas via código baseado no status que vem do banco
  statusPendente: { borderLeftColor: '#1976D2' },   // Azul para "Novos"
  statusPreparando: { borderLeftColor: '#FBC02D' }, // Amarelo para "Em Preparo"
  statusPronto: { borderLeftColor: '#4CAF50' },    // Verde para "Pronto para Retirar"

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333333',
    marginRight: 10,
  },
  orderMesa: {
    color: '#888888',
    fontSize: 14,
  },

  // --- BADGES (ETIQUETAS) ---
  badgeStatus: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  
  // Combinações de cores para os fundos e textos das badges
  badgeBgPendente: { backgroundColor: '#E3F2FD' },
  badgeTextPendente: { color: '#1976D2' },
  
  badgeBgPreparando: { backgroundColor: '#FFF8E1' },
  badgeTextPreparando: { color: '#FBC02D' },
  
  badgeBgPronto: { backgroundColor: '#E8F5E9' },
  badgeTextPronto: { color: '#2E7D32' },

  // --- LISTA DE ITENS DENTRO DO CARD ---
  cardBody: {
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQty: {
    fontWeight: '800',
    color: '#FF8C00', // Destaca a quantidade em laranja
    marginRight: 10,
    fontSize: 15,
  },
  itemName: {
    fontSize: 15,
    color: '#444444',
    flex: 1, // Faz o nome ocupar o resto da linha
  },

  // --- RODAPÉ DO CARD ---
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderStyle: 'dashed', // Estilo de linha pontilhada, lembrando um cupom fiscal
  },
  orderTime: {
    fontSize: 13,
    color: '#AAAAAA',
  },

  // --- ÁREA DE BOTÕES DE AÇÃO ---
  actionArea: {
    flexDirection: 'row',
  },
  btnAction: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextAction: {
    fontWeight: '800',
    fontSize: 13,
    color: '#FFFFFF',
  },
  
  // Cores específicas para cada ação do fluxo
  btnPreparar: { backgroundColor: '#FF8C00' },
  btnPronto: { backgroundColor: '#4CAF50' },
  btnEntregar: { backgroundColor: '#333333' },

  // --- ESTADOS VAZIOS OU CARREGAMENTO ---
  centerInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  centerInfoText: {
    color: '#BBBBBB',
    marginTop: 10,
    fontSize: 16,
  },
});
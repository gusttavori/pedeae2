import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1, // Substitui min-height: 100vh
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 10,
    // position: sticky e top: 0 não são necessários em views padrão do RN fora de ScrollViews
  },
  backButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  headerTitles: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF8200',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888888',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Lista de Itens
  scrollContainer: {
    flexGrow: 1, // Garante que a lista preencha a tela mesmo com poucos itens
  },
  listContainer: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Sombras Nativas Adaptadas
    elevation: 2, // Android
    shadowColor: '#000000', // iOS
    shadowOffset: { width: 0, height: 4 }, // iOS
    shadowOpacity: 0.05, // iOS
    shadowRadius: 12, // iOS
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8200',
  },

  // Controles de Quantidade
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  quantityBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginHorizontal: 12,
  },
  deleteBtn: {
    padding: 5,
    opacity: 0.7,
  },

  // Estado Vazio
  emptyContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 15,
    textAlign: 'center',
  },

  // Footer / Total
  footer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // Sombras Nativas
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
  },
  confirmButton: {
    backgroundColor: '#FF8200', // Adaptado: Linear Gradient exige biblioteca externa no RN
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center', // Garante a centralização do texto no botão
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
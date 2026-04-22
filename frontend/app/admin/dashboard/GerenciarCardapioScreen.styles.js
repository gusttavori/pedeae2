import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- CONTAINER PRINCIPAL ---
  adminContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Um fundo ligeiramente off-white para dar um ar mais limpo
    position: 'relative', // Essencial para que o 'successToast' consiga flutuar sobre toda a tela
  },

  // --- NOTIFICAÇÃO FLUTUANTE DE SUCESSO (TOAST) ---
  successToast: {
    position: 'absolute', // Desprende o elemento do layout padrão, fazendo ele "flutuar"
    top: 20, // Distância do topo da tela
    alignSelf: 'center', // Centraliza na horizontal
    backgroundColor: '#4CAF50', // Verde padrão de sucesso
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 999, // Garante que essa notificação sempre ficará na frente de TUDO na tela
    width: '90%',
    maxWidth: 400,
    
    // Sombras para destacar o aviso flutuante
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  successToastText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // --- CABEÇALHO ---
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, // Uma linha fina embaixo para separar o cabeçalho do resto
    borderBottomColor: '#EEEEEE',
  },
  backBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center', // Alinha o Título e o Subtítulo no centro
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '700',
    textTransform: 'uppercase', // Deixa todas as letras maiúsculas para dar um visual mais técnico/admin
    letterSpacing: 1,
  },

  // --- FORMULÁRIO E LAYOUT GERAL ---
  scrollContent: {
    flexGrow: 1, // Faz a área de rolagem empurrar o conteúdo até o final
  },
  adminContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF', // O formulário fica dentro de um "cartão" branco
    padding: 25,
    borderRadius: 24, // Bordas arredondadas modernas
    
    // Sombra leve para destacar o cartão do fundo cinza
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 10,
  },

  // --- ÁREA DE UPLOAD DA FOTO ---
  uploadBox: {
    width: '100%',
    height: 180, // Altura fixa para a caixa de imagem não quebrar o layout
    borderWidth: 2,
    borderStyle: 'dashed', // Borda pontilhada clássica de áreas de upload
    borderColor: '#DDDDDD',
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden', // Importante: Se a imagem escolhida passar das bordas arredondadas, ela será cortada
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlaceholderText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imgPreview: {
    width: '100%',
    height: '100%', // Faz a foto selecionada preencher todo o espaço da caixa pontilhada
  },

  // --- CAMPOS DE TEXTO (INPUTS) ---
  inputGroup: {
    marginBottom: 20, // Espaçamento padrão entre cada campo do formulário
  },
  inputGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FDFDFD',
    fontSize: 15,
    color: '#333333',
  },
  textArea: {
    height: 100, // Aumenta a altura para caber várias linhas
    textAlignVertical: 'top', // Correção essencial no Android: Faz o texto começar na parte superior da caixa, não no meio
  },
  inputRow: {
    flexDirection: 'row', // Coloca a Categoria e o Preço lado a lado
    gap: 15, // Espaço entre a Categoria e o Preço
  },
  
  // O sistema de Flex permite criar proporções. Flex 2 significa que vai ocupar o DOBRO de espaço do Flex 1.
  flex2: {
    flex: 2, // A caixa de Categoria fica maior
  },
  flex1: {
    flex: 1, // A caixa de Preço fica menorzinho
  },

  // --- BOTÃO DE SALVAR ---
  btnSalvar: {
    backgroundColor: '#FF8200', // Laranja vibrante para chamar atenção para a ação principal
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Descola o botão do último campo de texto
    
    // Sombra com a mesma cor do botão para criar um efeito de "brilho" (Glow)
    elevation: 5,
    shadowColor: '#FF8200',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  btnSalvarDisabled: {
    opacity: 0.7, // Quando o usuário clica e a tela está carregando, o botão fica levemente transparente
  },
  btnSalvarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
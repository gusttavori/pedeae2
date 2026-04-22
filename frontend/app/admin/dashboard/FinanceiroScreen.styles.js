import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- CONTAINER PRINCIPAL ---
  finContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Fundo cinza bem claro para realçar o branco dos cartões (UI limpa)
  },

  // --- CABEÇALHO ---
  finHeader: {
    backgroundColor: '#FF8C00', // Laranja do app para reforçar a identidade visual
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerInfo: {
    alignItems: 'center',
  },
  finTitle: {
    fontSize: 20,
    fontWeight: '800', // Bem espesso para dar peso de Título
    color: '#ffffff',
  },
  backBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- ÁREA DE FILTROS ---
  filterSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10, // Descola os filtros dos cartões de resumo
  },
  dateInputGroup: {
    flexDirection: 'row', // Coloca o campo de Início e o de Fim lado a lado
    gap: 15,
  },
  field: {
    flex: 1, // Faz com que ambos os campos de data tenham exatamente o mesmo tamanho (50% da tela cada)
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase', // Label em caixa alta dá um ar mais técnico e organizado
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#fdfdfd',
  },

  // --- CARTÕES DE RESUMO (KPIs) ---
  summaryGrid: {
    flexDirection: 'row', // Alinha os 3 cartões na horizontal
    justifyContent: 'space-between', // Espalha os cartões usando todo o espaço
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sumCard: {
    flex: 1, // Divide o espaço igualmente por 3
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    
    // Sombras bem suaves para os cards parecerem "clicáveis/flutuantes"
    elevation: 2, // Sombra Android
    shadowColor: '#000000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  sumLabel: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center', // Importante caso a tela seja pequena e o texto quebre em duas linhas
  },
  sumValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333', // Cinza muito escuro em vez de preto (#000), descansa mais a visão
    marginTop: 5,
  },

  // --- ÁREA DOS GRÁFICOS E LOADER ---
  scrollArea: {
    flexGrow: 1,
  },
  chartsArea: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 50, // Espaço extra no final para a rolagem ser confortável e não colar no limite do celular
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    
    // Sombra mais forte que os cards de resumo, pois essa é uma área mais volumosa da tela
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  chartCardTitle: {
    fontSize: 16,
    marginBottom: 30, // Muito espaço embaixo do título para acomodar os números em cima das barras
    color: '#444444',
    fontWeight: 'bold',
  },
  
  // --- A MÁGICA DOS GRÁFICOS EM CSS (FLEXBOX) ---
  chartCanvas: {
    height: 150, // Altura máxima que a barra de 100% vai atingir
    flexDirection: 'row',
    alignItems: 'flex-end', // Alinha todas as barras pela base (de baixo para cima)
    justifyContent: 'space-between',
    paddingTop: 20,
    borderBottomWidth: 2, // Cria a "linha do chão" (eixo X) do gráfico
    borderBottomColor: '#f0f0f0',
  },
  barWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end', // Garante que a barra fique sempre "colada" no chão
    height: '100%',
    position: 'relative', // Permite que o texto de data e valor flutuem para fora da barra
  },
  bar: {
    width: '60%', // A barra não ocupa 100% da largura, deixando um espaço natural entre cada dia
    backgroundColor: '#FF8C00', // Laranja para receita (dinheiro)
    borderTopLeftRadius: 4, // Arredonda só o topo da barra
    borderTopRightRadius: 4,
    minHeight: 2, // Mesmo se a receita for 0, mostra uma linhazinha para indicar que o dia existe
  },
  barPedidos: {
    backgroundColor: '#333333', // Cinza escuro para volume de pedidos, diferenciando visualmente do dinheiro
  },
  barLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FF8C00',
    position: 'absolute',
    top: -20, // Empurra o valor numérico para FORA (acima) da barra
  },
  barLabelPedidos: {
    color: '#333333',
  },
  barDate: {
    fontSize: 9,
    color: '#bbbbbb',
    position: 'absolute',
    bottom: -20, // Empurra a data para FORA (abaixo) da linha do chão
  },
  loaderArea: {
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
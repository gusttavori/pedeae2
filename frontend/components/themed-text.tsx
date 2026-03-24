// Importa as folha de estilo, componente de Texto Nativo e suas Props nativas de Tipagem do próprio SDK RN
import { StyleSheet, Text, type TextProps } from 'react-native';

// Importa Hook Customizado nosso que gerencia as Cores Dark/Light Mode dinâmicas
import { useThemeColor } from '@/hooks/use-theme-color';

// Typagem do Componente Definindo a intersecção de Parâmetros. Tudo oque Nativo React Native <Text/> Aceita + Nossas Custom Props
export type ThemedTextProps = TextProps & {
  lightColor?: string; // Cor estática opcional p Forçar Override no tema Claro
  darkColor?: string; // Cor estática opcional p Forçar Override no tema Escuro
  // Um Preset Selector de Tamanhos Fontes/Estilos Mapeados 
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

// Componente Wrapper Exportável Customizado (Substitui Componente Texto Nativo RN com Injector de Temas dinâmico CSS Styled Theme Text Wrapper)
export function ThemedText({
  style, // Classes styles customizados CSS-in-JS enviados do Componente Pai 
  lightColor, // Override opc
  darkColor, // Override opc
  type = 'default', // Fallback Padrão Param Default View Typo "Type" se o pai n especificar
  ...rest // Agrupa os demais Atributos Nativos como (numberOflines, onPress, ellipzeMode, childrenTexts) espalhando neles 
}: ThemedTextProps) {
  // Chamador Lógico que analisa o Ambiente (Dark/Light System Envm) e Devolve a colorHexadecimal String Corrente
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    // Usa e entrega a tag Pai Nativa <Text>
    <Text
      style={[
        { color }, // Base: injeta a color dinâmica processada pelo context Hook acima
        type === 'default' ? styles.default : undefined, // Regra Estilo Dinâmica se pai mandou Enum 
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style, // CSS Extra Merge Object (Estilos Override do Componente Master) permitindo o usuario fazer ajustes finos. Merging array priority left-to-right overriding CSS styles.
      ]}
      // Passa Propiedades Componentes Nativas Filhos rest element (Prop Espalhamento Spread)
      {...rest}
    />
  );
}

// Folha de Estilos Comum StyleSheet Local do Componente ThemedTexts Text Nodes View Components 
const styles = StyleSheet.create({
  // Css Font Settings Size e Linhas Bases Parágrafo
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Negrito Intermadiário SemiBold Titles and Labels
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  // Fonte Maior Gigante App H1 Tags Headers Headings SubHeadings Views Hero Headers  Styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  // Subtitulo Padrão Medio Negrito App Titles Sections Group Titles App Layout UI View 
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Textos Coloridos Acionaveis Sublinhados ExLinks Links
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});

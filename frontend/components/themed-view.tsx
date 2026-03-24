// Importa os Componente Nativo "View" de containers estilo DIV pra Mobile e sua Struct TypeScript
import { View, type ViewProps } from 'react-native';

// Importa hook customizado do projeto que monitora dark/light Mode Scheme 
import { useThemeColor } from '@/hooks/use-theme-color';

// O Objeto ThemedViewProps herda todos os Atributos Nativos React (ViewProps) E Soma as Configs Custom de Overwrite de cores
export type ThemedViewProps = ViewProps & {
  lightColor?: string; // Cor String Opc (?) Modificador Excepcional Tema Branco
  darkColor?: string; // Cor String Opc (?) Modificador Excepcional Tema Dark 
};

// Componente "Super Div" que Subsitui as Views React Normais aplicando Inteligencia Temática Automática Dinâmicos Theme Colors
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Lança o Hook Context e Obtem a HEXColor exata mapeada globalmente para chave global 'background'
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Devolve o Componente Container Base Nativo misturando a CSS Object Color Hook array style props nativas da Componente (Spreading Rest).
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

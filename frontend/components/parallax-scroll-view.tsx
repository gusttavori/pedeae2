// Type Importings do Core React e Views Core Native Engine Components. Tipando Types Components Models Structs e Native Views StyleSheet React Native SDK
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
// Complex Reanimated Animations Lib Hooking Hooks. Interpolaçoes Numerus. Animations ScrolViews Engine APIs Worklets Hooks Context e StyleHooks. Lib animations
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

// Meus Tematizadores Cores Componentes Custom Modulos Temas Theme Mode System
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

// Constante Global Mágica que baliza altura inicial máxima do HEADER (Imagens e Cores Topos das Scroll Views) (TETO Header 250pxl fixed)
const HEADER_HEIGHT = 250;

// Typagens Type Scrip das Propriedades Parametros Component. Obrigatorios e Suplementares Tipagens Interfaces Objs
type Props = PropsWithChildren<{
  headerImage: ReactElement; // Elemento Visual Native View Tree 
  headerBackgroundColor: { dark: string; light: string }; // Struct Dicionary color Mode Selector 
}>;

// Função Componente Customizada pra um Scroll View Diferenciado estilo "Efeito Parallax Background Imagem e Textos Escorregando com Diferentes Velocidades em Camadas Layout View CSS Tricks UI Animation Pattern Design"
export default function ParallaxScrollView({
  children, // Restante Nodes UI React 
  headerImage, // View Component Graphic Banner View Node UI Component Reac
  headerBackgroundColor, // Props Structs
}: Props) {
  // Chamadores Helpers Metodo Hook Extrai as Cores Theming basedo nos Context Configurations Modifiers OS Variables Envs Contextos Themas Settings
  const backgroundColor = useThemeColor({}, 'background'); // BG View Cor Padrão Container View Root Cor 
  const colorScheme = useColorScheme() ?? 'light'; // Hook Determina Variavel booleanas Qual Scheme Tema Aplicador Dark light Theming Switcher 
  // Pegando a Reference Element Control do Animated UI View DOM Virtual Mobile Engine Components Control References Hooks Bindings Elements View DOM. 
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // Binding Controlador de Tracker Escutas Eventos ScrollY Position Numerico Hook Updater Hook Binding Variables Value 
  const scrollOffset = useScrollOffset(scrollRef);
  
  // Magica Estilo Dinâmico de Animation "Worklet Threading Func Frame Update Cycle Engine UI Reanimated Framework Callback Methods UI Framerate Methods Updater Method View Frame Callback React Engine Style Component Style Binded Method State Dynamic Animation Engine Hook System Return Value Node Value Objects Styles View" .
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Propriedade CSS Translate Translações Transforms Matrices Geometry Properties Layout Transforms
      transform: [
        {
          // Translação de Matrix Layout Move Y Axis Geometry Translation Matrix Transforms Y Translate Transforms. Y Move UI Transforms . 
          translateY: interpolate(
            scrollOffset.value, // Valor Fonte Tracking Position Tracker
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT], // Tresholds Limitadores Limites
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75] // Interpolamento (Ex: Se Roda um, Move Metade Outros) O Famoso Efeito Paralaxe. "Eixo Y escorrega com Deslocamentos Modificados e Proporcionais Calculos" .
          ),
        },
        {
          // Mesma coisa mas fazendo Escalamento Geometrico. (Zoom out/In Effect Scales Scales Zoom Interpolation Scale Zoom Scales Geometry Animations CSS Scale Transformers Layout Matrix Geometry Size Resizing Zoom Scaling Scales Z Axises)
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]), // Tresholds Matrix Scaling Limits 
        },
      ],
    };
  });

  return (
    // Raíz Main Tag do Animated Scrollable Area
    <Animated.ScrollView
      ref={scrollRef} // Ref bindada acima p monitoramento API Lib Frameworks Variables Controllers Listeners Elements Tracker Binds Refs
      style={{ backgroundColor, flex: 1 }} // Cor Tematica 
      scrollEventThrottle={16}> {/* Perf Tuning Limitando a Quantos Framerate Escuta/Dispatch Scroll Event Trigger Listeners Update Framework Time Limits Triggers Ms 60Hz. */}
      {/* Container Pai onde o Style da Animação do Parallax WorkLet Dynamic Bind fica preso aplicando translações Matrizes Continuas */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] }, // Injeta Cor Dinamic Tema Objs Array Color Struct Type Definitions String Hex 
          headerAnimatedStyle, // Adiciona Obj Estilo de Tranformation Zoom / Translation Geometry Transforms Matriz Layouting Paralax Style Reanimated Node Object Value Hook Bind. 
        ]}>
        {/* Passa Props Component Banner Element Grafic Images SVG Views Native Core Elements Elements Component Child View View View Node UI Node React Render Graph Tree Leaf Elements Rendering Views Leaf Render Graph Elements Views React UI Rendering Tree Engine DOM View Mobile Graphics Child Eleemnt Prop */}
        {headerImage}
      </Animated.View>
      {/* Customizados View Render Context Filhos Views do App UI Component Nodes React Tree Views Rendering Text Blocks Images Buttons Lists Component Blocks Views Children Elements Nodes UI Block Views Context Themes Variaçoes Cores Context */}
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

// Hardcode Static Style Sheets Object Hash Mappings Definitions Blocks Css Inline Alternative Core UI Styles React Native Elements API StyleSheet Create Factory Styles Mappers Methods Objects Styling Hash Trees Styling Mappers Tree Views Styling Tree Factories Methods Classes Substitutes Styling Mapping API Dictionary Mapping Definitions Factory Styles Tree API Factory Styles Maps Tree Structure Definitions Maps Views Models Objects Style Blocks Style Rules CSS
const styles = StyleSheet.create({
  container: {
    flex: 1, // Full Fill Width e Heights Flex Box Flexing Elements Flex Box Flex Box Elements Growth Rate Size Dimensions Box Models Block Flex Block Scale Resizers Scales Growth Rate Size Model Flex Ratio Size Model Layout Layout Size Proportions Resizing Blocks Ratio Boxes Flexible Dimensions Scale Models Constraints Layout Flex Rules.
  },
  header: {
    height: HEADER_HEIGHT, // Bind 250 Fixes Limit Constraints Limits Constants View Limit Fix Height Limit Height Size Size Fixed Limit Block Dimension Constraints Limits 
    overflow: 'hidden', // Evita vasamentos Elementos Masks View Viewport Masks View Layout Masks Layout Overflow Hide Oculta fora caixas Viewport Blocks View Limiters 
  },
  content: {
    flex: 1, // Preencha Espaço Sobrantes Constraints Flexible Dimension Layout Free Space Taking Resizing Auto Dimensions Scales Box Fill Rates 
    padding: 32, // Margem Internas Afastamentos Text Layout Box Internal Spacings Layout Dimensions Margin Internals Layout Spacing Gaps Padding Internal Layout Box 
    gap: 16, // Flebox Spacer Layout Gap Flex Flex Gaps Flex Gaps Items Gap Flex Rows Columns Spacing Spaces Gap Flex Properties
    overflow: 'hidden', // Masking Protections Hide 
  },
});

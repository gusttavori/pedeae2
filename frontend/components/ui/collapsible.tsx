// Typagens e Hooks de Memória do Core JS React Engine States 
import { PropsWithChildren, useState } from 'react';
// Bibliotecas de Folha Estylizzada Native Components e Botões Presiveis sem Opacidades "TouchableOpacity" React Native Components View UI SDK
import { StyleSheet, TouchableOpacity } from 'react-native';

// Nossos Componentes Bases Text e Container Envelopados com Detecção Automatica de Cores (Themes wrappers)
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// Novo Padrão Unico Sistema Icones Vectoriais SDK Components SFSymbols (IOS) E Icons Android (Material) 
import { IconSymbol } from '@/components/ui/icon-symbol';
// Palette Master Dictionary of Color Themes Settings Constantes Colors Global
import { Colors } from '@/constants/theme';
// Customizado Getter de Themes Ativos Hooks (Dark mode Enabled boolean states values App Preferences Envs State Views Variables Constants Getter Theme Values Light OS Native Variables Preferences Context Color Mappers Hook Systems ) Hook OS Device Themes Envs Hook Settings Getters
import { useColorScheme } from '@/hooks/use-color-scheme';

// Componente Funcional que cria aqueles Acordeões Clica = Abre, Cliac = Fecha UI Dropdowns UI pattern components Dropdown Details. "Collapsibles" UI Expands Details Hidden Text Details Block Render Elements Views Grouping Blocks Hide And Show Pattern States Show Booleans Toggles Switches Toggle Button UIs Collapsible Elements.
export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  // Hook State Variável Booleana que Determina Visualmente de a Aba Abre ou Fecha (Visibilidade do children Content Node render Elements Group View UI). 
  const [isOpen, setIsOpen] = useState(false);
  // Detectar Variareis Nativas O.S preferences e Atribui Tema Fallback Light se for undefined Fallback coalescens Operators
  const theme = useColorScheme() ?? 'light';

  // Graphic Engine Return JSX DOM Engine Mappers Engine Layout Nodes Components Object Tree Layout DOM Nodes Render Elements Blocks Containers Blocks Context Context Layout React Nodes Layout Struct React Hierarchy Mappers Virtual DOM Tree
  return (
    // Usa nossso Background Tematico pra Raiz Root Wrapper "Div" 
    <ThemedView>
      {/* Container Botão Mestre Opaco Acionador Area de Toquee Finger Touch Target Blocks Clickable View Container Area Toggles Active Area Active Zone Hit Boxes Click Views Area Event Emitter Dispatches Area  */}
      <TouchableOpacity
        style={styles.heading} // Layout Flexbox Linha
        // Dispara Inversao Binaria Hook (Negativo da Var de state boolean). Ou seja Inversão Alternada (Toggle state) 
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}> {/* Opacidade visual Efeito Feedback Toque 80% */}
        {/* Usando Wrapper Misto Icones para Sistema Android x Ios nativos */}
        <IconSymbol
          name="chevron.right" // Código Name Ios/Android 
          size={18} // Props Dimension 
          weight="medium" // Props Stroke size Shape Fonts Size Bold 
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} // Define dinamico base tema System color 
          // Animação/Rotações Rotaciona 90graus a seta (Bico Point Down) quando ele "Abre Aba", Rotaciona 0graus Reset se fecha . Efeito UI Rotator Animations Rotate View 
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        {/* Nossos Themed Texts Label Titles do Dropdown Subtitles Bold  */}
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {/* Mágica de Render Condicional "&& And Operador Curto". Se isOPen = True, ai então Ele Pinta os Childrens Componentes React q foram passados pro Dropdown UI Collapsible. "Esconde Content". */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

// Hardcoded Hash Objects de Mapeamentos Propriedades de Aparencia Stylings React StyleSheet CSS API View Model React Framework Map StyleSheet CSS View System Properties Definitions Object Object Dictionary Dictionaries Styles Object 
const styles = StyleSheet.create({
  // Css Da "Barra de Titulo e Seta" Botões Flex Views
  heading: {
    flexDirection: 'row', // Divisões Lados Colunas lado ldos flex Views flexDirection Rows layout horizontal flex direction flow flex rules layout direction column flow orientation axis row orientation rules constraints rule flows flex orientations rule directions
    alignItems: 'center', // Vertical Center Axis Allign 
    gap: 6, // Entre Icon e Texto Space Gaps Flex
  },
  // Onde Vai Ficar O Corpo dos Texos (Conteudo Crianças Dropdon) Space Boxes Spacers Box Internal Layout Margins Space Internal padding margins spaces
  content: {
    marginTop: 6, // Distance do Titutlos Margings Distances Outers 
    marginLeft: 24, // Identação Margin Lefter Padding Outers Spaces Ident Spaces Left Size Width Identation Size Padding Layout Geometry Left Layout Offset Padding Layout Box Offset Internal Gapping Rules Margin Box Rule Rules Sizes Margins 
  },
});

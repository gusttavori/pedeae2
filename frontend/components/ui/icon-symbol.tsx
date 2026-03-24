// Comentário original: Este arquivo serve como um Substituto (Fallback) universal das dependencias quando roda no Android ou Browser Web onde as "Fontes SF Apple Symbols" não existem na Memoria RAM do Device. Carregando em cima do popular Icon "Material Icons do Google Font".
// Fallback for using MaterialIcons on Android and web.

// Importação pacataão popular Icones Expo Font Vector do Repositório MaterialFonts
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Importação Tipagem (Typescript Data Modeling e Checks Forms Validations Compilers Linters) Type Checking Type Modeling Types Interfaces Typings Modules 
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Type do Componente de Mapeamento Translation. (Faz o TypeCasting para Chaves Dicionario) Map de SymbolProps SF APPLE = Material Props Google API Type Definitions. Types Type Mapping Types Struct Map Struct Translation Model Dictionary Interface Mappings Structural Mapper Definition Mappings Typescript API Mapper Rules Interface Structure Mappings Models Data Definitions. 
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Área Original dos Criadores Expo Para Você Traduzir (Tradução Manual e Hardcoded de Dicionários HashTables Maps Object Configs List Rules ) De NOMES API APPLE para NOMES DE API GOOGLE FONT. Lista. 
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
// Exporta a Varável Matriz com as regras de tradução Chave-Valor. Sfsymbolos Name > Material nome respectiva
const MAPPING = {
  'house.fill': 'home', // EX: Se apple chamar de casa cheira, No android chame de "home"
  'paperplane.fill': 'send', 
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * Componente Interceptador Envelopado Exportavel Wrapper Component UI Component Design Pattern React Framework Views Nodes Hierarchy App Component Engine Node Graph React UI Context Wrapper Hook API Hook Call Hook Hook Render Tree Nodes Component React Leaf UI Render Export Modules Javascript Functions Declarations 
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name, // String de ID ex ("house.fill")
  size = 24, // Dims Square Sizes Default Variables Params Default
  color, // Core Hex color String 
  style, // Rest Styles Mappings View Styles Prop Components Prop Param
// Declaração Paramentros E Tipos
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Chamada de Return de Views Nodes Rendens HTML Components API: Devolve um Icone da fonte Google (Vetor Font Library Lib Nodes Views React) Onde O Nome Recebe Prop Name da Traducao Encontrada via Buscas no array ArrayObject do Dicionário MAPS Chave Valor Const variables. Props View Mappings Node Props View Attributes Attr Elements React Component View DOM XML View 
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

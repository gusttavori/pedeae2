// Pacote EXCLUSIVO nativo da APPLE SDK Para renderização ultraleve de Icones do OS Mac/iOS SF Symbols Engine (Não roda em Web/Android)
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
// Typagens para facilitar React Native Props Styles (Permitindo Customizar Sizes e etc vindo da View PAI em TypeScripts Type Checks Variables Bindings Typed Checks)
import { StyleProp, ViewStyle } from 'react-native';

// O Componente Envelopador (Wrapper) Icone iOS O Arquivo Possui (.ios) na extensão forçando Expo Bundler a Só exportar esse Arquivo se o Compilador for Rodar num iPhone ! Bundler Tricks Extension File Module Loadings Native Bundle Resolvers. Exclude on Android Loader Types Bundle . 
export function IconSymbol({
  name, // String de nomes padroes da Apple (ex: house.fill)
  size = 24, // Default Icon Size Numbers Dimensiosns Square sizes px
  color, // String Hex ou OS Colors 
  style, // Props View StyleSheet Object 
  weight = 'regular', // SF Symbol Typo Weight Config (Grosso, Fino, Bold , thin) Parametrization Apple Fonts Engines
// Construcao das Types e Interfaces das Variáveis Obrigatórios e Opcionais Props Obj
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    // Devovle The Native API SymbolView Tag To Framework Render Graphic Renderer Node Engine.  View Graphic Tag Apple Core SDK.
    <SymbolView
      weight={weight} // Thin, bold...
      tintColor={color} // Injecta Cor SVG Cor 
      resizeMode="scaleAspectFit" // Box Aspect Model Rules Scales Views Sizes Content Aspect Modes Fill/Contain Options Views
      name={name} // OS OS Identify SF Name Key Dictionary Key ID
      // Combinadores Array Style Mesclando Dimensões Absolutas de altura/largura ao CSS Customizado Propriedades Obj. Override Priorities Order Array React Native Styling Model Method CSS CSS Modules
      style={[
        {
          width: size, // Force px Square Bounds Geometry Elements Rules Height Box Boundaries
          height: size, // Force px Box Limit Rules Boundaries Dimension Sizes Size Dimensions Rules Limits Rules Box Sizes Height Size Pixel View Size Pixel Properties Node Layout Property Layout Geometry Transforms Elements Dimensions Style
        },
        style,
      ]}
    />
  );
}

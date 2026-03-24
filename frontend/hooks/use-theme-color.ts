/**
 * Instrucoes Da Dev Expo Sobre System Color e Tematização Dark Mode UI Colors Views Theming UI Pattern Design
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// Puxa Dicionário "Paleta de Cores Globais da Marca App" Palette Definitions Values
import { Colors } from '@/constants/theme';
// Hook Analizador do SO System Themes
import { useColorScheme } from '@/hooks/use-color-scheme';

// Cria Um Hook / Função Reutilizável Específico "Gettar Cores pra Pintar View de Acordo com Tema Atual em Tempo Roda (Runtime) Dark/Light Context"  
export function useThemeColor(
  // Padrão Typescript defininido que essa func pode opcionalmente receber Override manual String 
  props: { light?: string; dark?: string },
  // Exige que quem chama Passe qual VARIAVEL de cor ele quer pintar (keyof "text", "background" e obriga checar q existe dict Colors types validations). Typeof Enum Mapping Type Definition Keys Definitions Interface Types Validations Type Checks Code Inteligence Code Compillers Keys
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Checa Se o Tema Aparelho OS tá Light ou Dark. Sendo Undefined forca 'light' Null Coalescencing Operator Theme Val. Fallback Variables Context OS Settings Value Fallbacks Theme Rules Types Checks Get Values Hooks. OS Native Variables
  const theme = useColorScheme() ?? 'light';
  // Extrai dos parametros enviados pra ca o Valor Sobrescrito (se a view chamadora tiver Enviado param Custom e Nao Quiser Usar O Global Param Props). Parameters Destructors Keys Values Find. 
  const colorFromProps = props[theme];

  // Regra Devolver. Se A tela Passou Cor Custom "Use e Sobresccreva Global Cor Theme Object Var"
  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Se Nao passpu, Faz um "Find" Exato Navegando nos array Objects Constants Colors da Palleta Global puxando Pela Chave a Propriedade CSS Correta Cor Hexadecimal Ex: '#FFF' Values CSS Values Theme Colors Values Const Return Mapper Functions Colors Return Val Colors Scheme Colors
    return Colors[theme][colorName];
  }
}

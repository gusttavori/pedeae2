/**
 * Abaixo estão as cores globais utilizadas no aplicativo (Palette/Paleta). Separadas por Modo Claro e Escuro.
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Importa módulo nativo do RN que nos permite saber em qual SO o app está rodando (iOS, Android, Web)
import { Platform } from 'react-native';

// Constante de Cor Variante Matiz Azulada Padrão Expo Claro
const tintColorLight = '#0a7ea4';
// Constante de Cor Variante Matiz Branca Padrão Expo Escuro
const tintColorDark = '#fff';

// Exporta o Dicionário/Objeto Mestre com as Configurações Hexadecimais para O Contexto de Themas consumido nos Hooks e Views Customizadas do App UI Components Color Modes System Mappers Constants
export const Colors = {
  // Configurações e Valores quando O Aparelho estiver no Modo Diurno "Claro"
  light: {
    text: '#11181C', // Preto/Cinza bem Escuro para Textos App
    background: '#fff', // Branco puro fundo Views
    tint: tintColorLight, // Detalhes ou Highlights Primary Colors
    icon: '#687076', // Cinzas neutros para Icones Base
    tabIconDefault: '#687076', // Cor Ícone da Aba inferior desligado
    tabIconSelected: tintColorLight, // Aba Ativa Cor de Highlight 
  },
  // Configurações e Valores quando O Aparelho estiver no Modo Noturno "Escuro" (Dark mode)
  dark: {
    text: '#ECEDEE', // Branco Pastel Cinza para nao Cegar a noite Texto 
    background: '#151718', // Escuro Opaco (Nao e preto absoluto para economizar oled e evitar alto contraste massante)
    tint: tintColorDark, // Branco Brilhante p destaque Elements
    icon: '#9BA1A6', // Icones off Light grey Colors
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Objeto Mapeador Tipográfico das Fontes do Sistema Baseado Na PLATAFORMA. (Usa Tipologia NATIVA do Padrão UI Design Languages O.S) Platform.select
export const Fonts = Platform.select({
  // Mapeia Familiares Nativos Fonte Apple (San Franscico / SF Rounded) Apple Interface Design Guidelines Typography System Fonts
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  // Mapeamentos Padrão (Android: Roboto Native Typography Types)
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  // Fallbacks de Suporte Padrão Browsers PC/Desktop/Web (Stack CSS Fonts Array Font Family Web System Standard Design Systems CSS)
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

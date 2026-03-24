// Biblioteca expo / Reanimated de micro-interações performáticas via Worklets Threads 
import Animated from 'react-native-reanimated';

// Componente decorativo do Hello Mãozinha Dando tchau (Welcome Hello Text)
export function HelloWave() {
  return (
    // Usa um Text transformado em camada Reanimated Engine Renderer Node View  Text View Render.
    <Animated.Text
      // Aplicando Regras Objeto estilo misto Css em React Native (Acessories API Reanimated Styles Animations)
      style={{
        fontSize: 28, // Altura 
        lineHeight: 32, // Espaço Linha texto Vertical  Aligner Centralizations Texts
        marginTop: -6, // Push Up Layout Margins Hack Centralization Texts Inline Heights View Block Component
        // Objeto de animação Inline Keyframes puro de 0% e 100%. Quando atinge Meta (50%) realiza Transform rotate property Node Value Degrees Angles Animations Frame Steps Engine View Updates UI
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        // Realiza um Loop infinito de idas e vindas batendo Meta e Voltas de animações
        animationIterationCount: 4, // Quatro vezes o Shake Acenos (Waving hands Tchausinhos )
        animationDuration: '300ms', // Super Rapido Ms Time Stamp Delay Time Timeouts Interpolation Transition Speed Animations Speed
      }}>
      👋
    </Animated.Text>
  );
}

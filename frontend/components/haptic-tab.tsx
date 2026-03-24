// Importa Tipagem dos Botões de Tab Bottom 
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
// Importa o encapsulador pressable do React Navigation adaptativo por plataforma
import { PlatformPressable } from '@react-navigation/elements';
// Importa o subpacote módulo Expo para vibração háptica tátil (Motor Cellphone Vibratos do Sistema e Taptic Engine)
import * as Haptics from 'expo-haptics';

// Exporta componente Botão Tátil que envolverá os ícones das Tabs do NavBar (Rodapé)
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    // Invólucro Nativo Component
    <PlatformPressable
      // Despeja todo o resto
      {...props}
      // Receptador Nativo Click View Mobile On Press (Antes Do OnClick React) Events Handler Press IN Touch Screen Sensor Down Touch Events Handler Hook Callback Events Trigger Fire System Action Native Engine 
      onPressIn={(ev) => {
        // Bloqueio condicional checando Se Plataforma for um Aparelho iOS Nativo (Exclusividade Funcional Apple Taptic Engine API) 
        if (process.env.EXPO_OS === 'ios') {
          // Dispara um Pulso Leve de Vibração Tátil Taptic Engine OS Core Native Feedback API call SDK Expo Bridge
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Repassa O Evento Trigger Touch para a Função Mãe Origial Props.OnPressIn()
        props.onPressIn?.(ev);
      }}
    />
  );
}

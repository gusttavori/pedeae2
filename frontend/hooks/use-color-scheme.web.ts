// Hooks Padrões Gestão Ciclos De VIda e Memórias do React JS React Web JS Components Engine React Node Lib Modules Importations React
import { useEffect, useState } from 'react';
// Importação e Apelidamento de Hook do Color Scheme q vem da Lib Web Native 
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Este Arquivo Só Roda Quando o App é Aberto em Navegador Web (.web.js). Ele Conserta Problemas onde "Server-Side Rendering Static Site Generations SSR" poderia travar a Cor Inicial e nunca mudar. 
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
// Hook Específifo Export p/ Ambientes Browser Web JS Engine React Web 
export function useColorScheme() {
  // Controle Flag Estado "Se a Camada Client Browser ja absorbeu e desenhou Virtual DOM SSR (Hidratação React Hydration)" Bool variables Hydratation Hook Controls  
  const [hasHydrated, setHasHydrated] = useState(false);

  // Gatilho Efeito Dispara apenas 1 Vez Apóso 1 Render do Browser DOM Html 
  useEffect(() => {
    // Liga a Flag (Sim, Hidratado DOM) React View Ready
    setHasHydrated(true);
  }, []);

  // Recebe a variação React Native Colors (Se tá light ou dark) no JS Local System 
  const colorScheme = useRNColorScheme();

  // Se já Rendou Web Dom
  if (hasHydrated) {
    return colorScheme; // Permite a troca dinamica da Var
  }

  // Falco Pulo Padrão Falso Antes da Hidratar Evitando SSR Flicker Error.  CSS Colors Modes Default Fallback Values
  return 'light';
}

// Importa os tipos e componentes nativos do expo-router para links
import { Href, Link } from 'expo-router';
// Importa o módulo web browser do Expo que permite abrir uma view do navegador in-app sem sair do app
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
// ComponentProps tipagem para auxiliar construção do Wrapper Typescript
import { type ComponentProps } from 'react';

// Define Props TypeScript herdando as propriedades do comp "<Link>" nativo sem conflitar propriedade href que ganha tipagem customizada 
type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

// Exporta o Subcomponente Encapsulador de Links
export function ExternalLink({ href, ...rest }: Props) {
  return (
    // Usa Componente de Ligações Nativo Expo 
    <Link
      // Atrinuto Web Link Blank
      target="_blank"
      // Rest spread espalha any other Props properties injectadas via HTML Elements Args Tag declarations parent element scope
      {...rest}
      // Passagem Absoluta Web String Protocol Domain Name Route 
      href={href}
      // Listener Handler Metodo Native de Toque em Botões no CellPhone Tela Devices 
      onPress={async (event) => {
        // Logica Condicional Operacional avaliativa do Sistema Hospedeiro (iOS, Android vs WebBrowser Html Client)
        if (process.env.EXPO_OS !== 'web') {
          // Prevene/Mata a Action Nativo do componente que nos casos Mobile OSs Tentaria abrir o "App Safari" Ou "Google Chrome Browser App" forçando fechar nosso App (Redirect Loss).
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Substitui a action abrindo modal web InAppBrowser Browser Mode View. (Experiência Continuada Mobile System Modal Sheets Apps UX patterns).
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            // Estilo Modal Sheet Automática do OS Visual Component View. (Deslizando cards Mobile Native Style View).
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}

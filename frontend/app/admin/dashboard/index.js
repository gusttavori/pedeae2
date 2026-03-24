// Importa a biblioteca base do React
import React from 'react';
// Importa os ícones padronizados via Expo Vector Icons
import { Ionicons } from '@expo/vector-icons';
// Importa o hook para lidar com as transições/redirecionamentos de tela
import { useRouter } from 'expo-router';
// Importa o método de desconectar os usuários atuais armazenados nos Cookies/DB internos do Firebase
import { signOut } from 'firebase/auth';
// Autenticação préviamente iniciada no arquivo inicial do App/Config
import { auth } from '../../../src/config/firebase';

// Vincula a estilização contendo especificações flexbox desse arquivo
import './index.css';

// Componente inicial tela do Menu do Dashboard
export default function AdminDashboardIndex() {
  // Instância roteador pra gerar controles dos links 
  const router = useRouter();

  // Função assíncrona voltada a desconexão de usuários logados perante ao App Firebase Client Auth 
  const handleSair = async () => {
    try {
      // Solicita a rede que invalide o token de acesso 
      await signOut(auth);
      // Registra a saída com sucesso caso libere a Promise de SignOut Firebases
      console.log("Sessão encerrada com sucesso.");
      
      // REDIRECIONAMENTO FORÇADO: Substitui as pilhas da base pra ninguém dar 'stack back/puxão de volta' com o dedão do Mobile sem novo login.
      router.replace('/admin/login'); 
      
    } catch (error) {
      // Dispara nos devTolls o problema caso de desconexão bloqueada
      console.error("Erro ao sair:", error);
      // Notifica com o Alert nativo cru Javascript que houve treta na tela de Sair.
      alert("Erro ao tentar sair do sistema.");
    }
  };

  // Centraliza e minimiza a escrita código repetido "Cards de Botões das Áreas principais" em uma Função Component-Creator Arrow inline
  const renderMenuCard = (title, description, iconName, route, color) => (
    // Card Wrapper Container agindo como Clicavel jogando rotas Push no router 
    <button 
      className="menuCard" 
      onClick={() => router.push(route)}
    >
      {/* Insere cores de backgrounds em transparência Opacidade 15Hex (%) e a base solida Color Prop como Ícone */}
      <div className="iconContainer" style={{ backgroundColor: color + '15' }}>
        <Ionicons name={iconName} size={32} color={color} />
      </div>
      {/* Alinha as descrições em bloco de texto e títulos custom */}
      <div className="menuInfo">
        <span className="menuTitle">{title}</span>
        <span className="menuDescription">{description}</span>
      </div>
      {/* Adiciona um chevron setinha pro lado de cor cinza para intuir o Clico Touch Screen Call To action */}
      <Ionicons name="chevron-forward" size={24} color="#CCC" />
    </button>
  );

  return (
    // Tela completa App
    <div className="dashboardContainer">
      {/* Top Header App Bars Navbar Estilos Globais Orange PedeAe */}
      <header className="dashboardHeader">
        {/* Adiciona link pra quem quer dar um push back à Home Cliente principal Root Router App */}
        <button className="iconBtn" onClick={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color="#FFF" />
        </button>
        
        {/* Título textual indicativo */}
        <span className="headerText">Painel de Controle</span>
        
        {/* BOTÃO DE LOGOUT AQUI */}
        {/* O OnCLick liga as funções Firebase de Sing Outs limpando storages sessions locais de device Auth Caches. */}
        <button className="iconBtn" onClick={handleSair} title="Sair do Sistema">
          <Ionicons name="log-out-outline" size={28} color="#FFF" />
        </button>
      </header>

      {/* Frame Principal Branco do Sistema Flex Container das Lists */}
      <main className="dashboardContent">
        {/* Agrupamento Greeting / Cumprimentões Iniciais Título da Page */}
        <div className="welcomeSection">
          <h2 className="welcomeText">Olá, Administrador 👋</h2>
          <p className="subtitleText">O que você deseja gerenciar hoje?</p>
        </div>

        {/* Lista Container Gap englobados do Grid */}
        <div className="menuContainer">
          
          {/* Constroi Componentizar Cards Botão Painel de Pedidos/KDS usando chamadas CallBack do Const Creator Function Acima */}
          {renderMenuCard(
            "Gestão de Pedidos", // Prop de Título
            "Acompanhe e atualize o status dos pedidos em tempo real.", // Description Textual Text
            "fast-food", // Name prop pro pacote Ionicons Native Componentizar render 
            "/admin/dashboard/pedidos", // Destino Absoluto da URL Next/Expo Router push function pointer
            "#E33E42" // Cor Predominante Tematizar Theme Base Vermelho Alert App 
          )}

          {/* Chama Render do modulo Relatórios e Dashboard Dinâmicos*/}
          {renderMenuCard(
            "Financeiro",
            "Visualize suas receitas, gráficos e fluxo de caixa.",
            "bar-chart",
            "/admin/dashboard/financeiro",
            "#FF8C00" // Laranja Principal 
          )}

          {/* Chama Render do Admin Cadastros C.R.U.D base Firestore produtos de Cardápio App Pedeaê */}
          {renderMenuCard(
            "Cardápio",
            "Adicione, edite ou remova produtos do seu catálogo.",
            "restaurant",
            "/admin/dashboard/cardapio",
            "#4CAF50" // Verde Sucesso App Add Items
          )}
        </div>
      </main>
    </div>
  );
}
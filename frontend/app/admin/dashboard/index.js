import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../src/config/firebase';

// CSS Separado
import './index.css';

export default function AdminDashboardIndex() {
  const router = useRouter();

  // Função para fazer logout com redirecionamento forçado
  const handleSair = async () => {
    try {
      await signOut(auth);
      console.log("Sessão encerrada com sucesso.");
      
      // REDIRECIONAMENTO FORÇADO: Garante que o usuário vá direto para a tela de login
      router.replace('/admin/login'); 
      
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao tentar sair do sistema.");
    }
  };

  // Função auxiliar para renderizar os botões do menu
  const renderMenuCard = (title, description, iconName, route, color) => (
    <button 
      className="menuCard" 
      onClick={() => router.push(route)}
    >
      <div className="iconContainer" style={{ backgroundColor: color + '15' }}>
        <Ionicons name={iconName} size={32} color={color} />
      </div>
      <div className="menuInfo">
        <span className="menuTitle">{title}</span>
        <span className="menuDescription">{description}</span>
      </div>
      <Ionicons name="chevron-forward" size={24} color="#CCC" />
    </button>
  );

  return (
    <div className="dashboardContainer">
      {/* Header Laranja */}
      <header className="dashboardHeader">
        <button className="iconBtn" onClick={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color="#FFF" />
        </button>
        
        <span className="headerText">Painel de Controle</span>
        
        {/* BOTÃO DE LOGOUT AQUI */}
        <button className="iconBtn" onClick={handleSair} title="Sair do Sistema">
          <Ionicons name="log-out-outline" size={28} color="#FFF" />
        </button>
      </header>

      <main className="dashboardContent">
        <div className="welcomeSection">
          <h2 className="welcomeText">Olá, Administrador 👋</h2>
          <p className="subtitleText">O que você deseja gerenciar hoje?</p>
        </div>

        {/* Menu de Navegação */}
        <div className="menuContainer">
          {renderMenuCard(
            "Gestão de Pedidos",
            "Acompanhe e atualize o status dos pedidos em tempo real.",
            "fast-food",
            "/admin/dashboard/pedidos",
            "#E33E42" // Vermelho/Laranja escuro
          )}

          {renderMenuCard(
            "Financeiro",
            "Visualize suas receitas, gráficos e fluxo de caixa.",
            "bar-chart",
            "/admin/dashboard/financeiro",
            "#FF8C00" // Laranja Principal
          )}

          {renderMenuCard(
            "Cardápio",
            "Adicione, edite ou remova produtos do seu catálogo.",
            "restaurant",
            "/admin/dashboard/cardapio",
            "#4CAF50" // Verde
          )}
        </div>
      </main>
    </div>
  );
}
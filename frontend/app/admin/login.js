// Importa a biblioteca React e o hook useState para gerenciar estados
import React, { useState } from 'react';
// Importa componentes visuais do React Native: Image para fotos e ActivityIndicator para carregamento
import { Image, ActivityIndicator } from 'react-native';
// Importa os ícones da biblioteca Ionicons do Expo
import { Ionicons } from '@expo/vector-icons';
// Importa a função de login com email e senha do Firebase Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
// Importa a instância configurada de autenticação do nosso projeto
import { auth } from '../../src/config/firebase';
// Importa o hook useRouter do expo-router para navegação entre telas
import { useRouter } from 'expo-router';
// Importa o arquivo de estilos CSS específico para a tela de login
import './login.css';

// Define e exporta o componente principal da tela de Login
export default function LoginScreen() {
    // Cria o estado para armazenar o email digitado pelo usuário
    const [email, setEmail] = useState('');
    // Cria o estado para armazenar a senha digitada pelo usuário
    const [password, setPassword] = useState('');
    // Cria o estado para controlar a exibição do indicador de carregamento (loading)
    const [loading, setLoading] = useState(false);
    // Cria o estado para armazenar e exibir mensagens de erro
    const [errorMsg, setErrorMsg] = useState('');
    // Inicializa o roteador para permitir a navegação
    const router = useRouter();

    // Define a função assíncrona responsável por processar o login
    const handleLogin = async (e) => {
        // Previne o comportamento padrão do formulário web (recarregar a página)
        e.preventDefault();
        // Verifica se o campo de e-mail ou o campo de senha estão vazios
        if (!email || !password) {
            // Define uma mensagem de erro pedindo para preencher tudo
            setErrorMsg("Preencha todos os campos.");
            // Interrompe a execução da função se faltar dados
            return;
        }

        // Ativa o estado de carregamento para mostrar que o login está processando
        setLoading(true);
        // Limpa qualquer mensagem de erro anterior
        setErrorMsg('');

        // Tenta executar o bloco de código a seguir
        try {
            // Tenta autenticar o usuário no Firebase com o email e senha fornecidos
            await signInWithEmailAndPassword(auth, email, password);
            // Se der sucesso, o _layout.js intercepta e joga pro Dashboard automaticamente!
        } catch (error) { // Intercepta caso ocorra algum erro na autenticação
            // Registra o erro no console para fins de depuração
            console.error(error);
            // Define uma mensagem de erro genérica para o usuário
            setErrorMsg("E-mail ou senha incorretos.");
            // Desativa o indicador de carregamento pois a tentativa falhou
            setLoading(false);
        }
    };

    // Retorna a estrutura visual da tela (JSX)
    return (
        // Container principal que engloba toda a tela de login
        <div className="loginContainer">
            {/* Botão para voltar à página inicial */}
            <button className="backBtnHome" onClick={() => router.replace('/')}>
                {/* Ícone de seta para a esquerda */}
                <Ionicons name="arrow-back" size={24} color="#333" />
            </button>

            {/* Cartão branco central onde fica o formulário */}
            <div className="loginCard">
                {/* Cabeçalho do cartão contendo logo, título e subtítulo */}
                <div className="loginHeader">
                    {/* Imagem do logotipo do PedeAê */}
                    <Image
                        source={require('../../assets/images/logo-pedeae.png')}
                        style={{ width: 140, height: 45, resizeMode: 'contain' }}
                    />
                    {/* Título principal do cartão */}
                    <h2 className="loginTitle">Acesso Restrito</h2>
                    {/* Subtítulo explicando o propósito da área */}
                    <p className="loginSubtitle">Área de gerenciamento do restaurante</p>
                </div>

                {/* Formulário HTML que dispara a função handleLogin ao ser enviado */}
                <form onSubmit={handleLogin} className="loginForm">
                    {/* Container para o campo de entrada do e-mail */}
                    <div className="inputBox">
                        {/* Rótulo (Label) informando o que digitar */}
                        <label>E-mail</label>
                        {/* Campo de entrada de texto nativo do HTML para o e-mail */}
                        <input
                            type="email"
                            placeholder="admin@pedeae.com.br"
                            // Liga o valor do input à variável de estado 'email'
                            value={email}
                            // Atualiza o estado 'email' sempre que o usuário digitar algo
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Container para o campo de entrada da senha */}
                    <div className="inputBox">
                        {/* Rótulo (Label) informando o que digitar */}
                        <label>Senha</label>
                        {/* Campo de entrada de texto nativo do HTML ocultando a senha */}
                        <input
                            type="password"
                            placeholder="••••••••"
                            // Liga o valor do input à variável de estado 'password'
                            value={password}
                            // Atualiza o estado 'password' sempre que o usuário digitar algo
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Exibe dinamicamente a div de erro somente se a variável errorMsg possuir texto */}
                    {errorMsg ? <div className="errorMsg">{errorMsg}</div> : null}

                    {/* Botão de envio do formulário, fica desativado (disabled) enquanto estiver carregando */}
                    <button type="submit" className="loginBtn" disabled={loading}>
                        {/* Se estiver carregando, mostra o spinner (ActivityIndicator), senão mostra o texto */}
                        {loading ? <ActivityIndicator color="#FFF" /> : "ENTRAR NO SISTEMA"}
                    </button>
                </form>
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import { View, Text, TextInput, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Função oficial do Firebase para login
import { auth } from '../../src/config/firebase'; // Sua configuração do Firebase
import { useRouter } from 'expo-router';

// Importa os estilos que definem o visual "Clean" da tela
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
    // Estados para controlar o que o usuário digita e o feedback da tela
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Ativa o "giragira" no botão
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    /**
     * Tenta autenticar o usuário no Firebase.
     * Note que aqui não usamos 'e.preventDefault()' porque no Native não há recarregamento de página.
     */
    const handleLogin = async () => {
        // Validação simples antes de gastar internet com o Firebase
        if (!email || !password) {
            setErrorMsg("Preencha todos os campos.");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            // Envia as credenciais para o Firebase
            await signInWithEmailAndPassword(auth, email, password);
            // Se der certo, o Firebase atualiza o estado global e o Root Layout costuma redirecionar
            // Mas você também pode forçar a navegação se preferir.
        } catch (error) {
            console.error(error);
            // Feedback amigável para o usuário em caso de erro
            setErrorMsg("E-mail ou senha incorretos.");
            setLoading(false); // Para o carregamento para o usuário tentar de novo
        }
    };

    return (
        <View style={styles.loginContainer}>
            
            {/* BOTÃO VOLTAR: Posicionado de forma absoluta no topo */}
            <TouchableOpacity 
                style={styles.backBtnHome} 
                onPress={() => router.replace('/')}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.loginCard}>
                {/* CABEÇALHO DO CARD */}
                <View style={styles.loginHeader}>
                    <Image
                        source={require('../../assets/images/logo-pedeae.png')}
                        style={{ width: 140, height: 45, resizeMode: 'contain' }}
                    />
                    <Text style={styles.loginTitle}>Acesso Restrito</Text>
                    <Text style={styles.loginSubtitle}>Área de gerenciamento do restaurante</Text>
                </View>

                {/* FORMULÁRIO DE LOGIN */}
                {/* No Mobile, usamos Views para agrupar, já que <form> não existe */}
                <View style={styles.loginForm}>
                    
                    {/* CAMPO: E-MAIL */}
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxLabel}>E-mail</Text>
                        <TextInput
                            style={styles.inputBoxInput}
                            placeholder="admin@pedeae.com.br"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail} // No Native, recebemos o texto direto, sem o 'e.target.value'
                            keyboardType="email-address" // Abre o teclado com o símbolo de '@' visível
                            autoCapitalize="none" // Impede que o celular coloque a primeira letra em maiúsculo
                        />
                    </View>

                    {/* CAMPO: SENHA */}
                    <View style={styles.inputBox}>
                        <Text style={styles.inputBoxLabel}>Senha</Text>
                        <TextInput
                            style={styles.inputBoxInput}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true} // Esconde os caracteres (padrão de senha)
                        />
                    </View>

                    {/* MENSAGEM DE ERRO: Só aparece se 'errorMsg' tiver conteúdo */}
                    {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}

                    {/* BOTÃO DE ENTRAR */}
                    <TouchableOpacity 
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]} 
                        onPress={handleLogin} 
                        disabled={loading} // Impede múltiplos cliques enquanto carrega
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginBtnText}>ENTRAR NO SISTEMA</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
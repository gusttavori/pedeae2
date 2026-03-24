import React, { useState } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/config/firebase';
import { useRouter } from 'expo-router';
import './login.css';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita recarregar a página web
        if (!email || !password) {
            setErrorMsg("Preencha todos os campos.");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Se der sucesso, o _layout.js intercepta e joga pro Dashboard automaticamente!
        } catch (error) {
            console.error(error);
            setErrorMsg("E-mail ou senha incorretos.");
            setLoading(false);
        }
    };

    return (
        <div className="loginContainer">
            <button className="backBtnHome" onClick={() => router.replace('/')}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </button>

            <div className="loginCard">
                <div className="loginHeader">
                    <Image 
                        source={require('../../assets/images/logo-pedeae.png')} 
                        style={{ width: 140, height: 45, resizeMode: 'contain' }}
                    />
                    <h2 className="loginTitle">Acesso Restrito</h2>
                    <p className="loginSubtitle">Área de gerenciamento do restaurante</p>
                </div>

                <form onSubmit={handleLogin} className="loginForm">
                    <div className="inputBox">
                        <label>E-mail</label>
                        <input 
                            type="email" 
                            placeholder="admin@pedeae.com.br"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="inputBox">
                        <label>Senha</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMsg ? <div className="errorMsg">{errorMsg}</div> : null}

                    <button type="submit" className="loginBtn" disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : "ENTRAR NO SISTEMA"}
                    </button>
                </form>
            </div>
        </div>
    );
}
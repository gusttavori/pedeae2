import React, { useState } from 'react';
import { Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { useCart } from '../src/context/CartContext';
import './confirmacao.css';

export default function ConfirmacaoScreen() {
    const router = useRouter();
    const { items: cart = [], cartTotal, clearCart } = useCart();
    const [enviando, setEnviando] = useState(false);
    const [mesa, setMesa] = useState('');

    const finalizarPedido = async () => {
        if (!mesa) {
            alert('Por favor, informe o número da sua mesa.');
            return;
        }
        setEnviando(true);

        try {
            // Enviando o pedido para a coleção 'pedidos' no Firebase
            await addDoc(collection(db, 'pedidos'), {
                itens: cart,
                total: cartTotal,
                mesa: mesa,
                status: 'pendente',
                criadoEm: new Date()
            });

            // Limpa o carrinho após o sucesso
            clearCart();
            
            // Feedback de sucesso
            alert('Pedido enviado com sucesso para a cozinha! 🎉');
            router.replace('/'); // Volta para a Home limpando a pilha de navegação

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert('Erro ao enviar pedido. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="confirmContainer">
            <header className="confirmHeader">
                <button className="backBtn" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </button>
                <div className="headerLogo">
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                </div>
                <div style={{ width: 40 }}></div>
            </header>

            <main className="confirmContent">
                <div className="confirmCard">
                    <h2 className="confirmTitle">Finalizar Pedido</h2>
                    <p className="confirmSubtitle">Confirme os detalhes e informe sua mesa</p>

                    <div className="inputGroup">
                        <label>Número da Mesa</label>
                        <input 
                            type="number" 
                            className="mesaInput" 
                            placeholder="Ex: 05"
                            value={mesa}
                            onChange={(e) => setMesa(e.target.value)}
                        />
                    </div>

                    <div className="resumoPedido">
                        <p className="resumoTitle">Resumo dos Itens</p>
                        {cart.map((item) => (
                            <div key={item.id} className="resumoItem">
                                <span>{item.quantity}x {item.title || item.nome}</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                        <div className="divisor"></div>
                        <div className="resumoTotal">
                            <span>Total</span>
                            <span>R$ {Number(cartTotal).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    <button 
                        className="btnFinalizar" 
                        onClick={finalizarPedido}
                        disabled={enviando || cart.length === 0}
                    >
                        {enviando ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            "ENVIAR PARA A COZINHA"
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
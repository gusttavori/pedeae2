import React from 'react';
import { Image } from 'react-native'; // Importamos o componente Image
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import './carrinho.css';
import { useCart } from '../src/context/CartContext';

export default function CartScreen() {
    const router = useRouter();
    
    // Pegamos os itens (com apelido de cart) e o valor total do contexto
    const { items: cart = [], updateQuantity, removeFromCart, cartTotal } = useCart();

    const renderItem = (item) => (
        <div className="cartItem" key={item.id}>
            <img src={item.image} className="productImage" />
            
            <div className="productInfo">
                <p className="productName">{item.title || item.nome}</p> 
                <p className="productPrice">
                    R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </p>
            </div>

            <div className="actionsContainer">
                <div className="quantityControl">
                    <button
                        className="quantityBtn"
                        onClick={() => updateQuantity(item.id, 'decrement')}
                    >
                        <Ionicons name="remove" size={16} color="#FF8200" />
                    </button>

                    <span className="quantityText">{item.quantity}</span>

                    <button
                        className="quantityBtn"
                        onClick={() => updateQuantity(item.id, 'increment')}
                    >
                        <Ionicons name="add" size={16} color="#FF8200" />
                    </button>
                </div>

                <button
                    className="deleteBtn"
                    onClick={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF8200" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <button className="backButton" onClick={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#222222" />
                </button>

                <div className="headerTitles">
                    {/* TROCAMOS O H2 PELA LOGO PADRONIZADA */}
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                    <p className="headerSubtitle">Meu pedido</p>
                </div>

                <div style={{ width: 24 }}></div>
            </div>

            {/* Cart */}
            {cart.length === 0 ? (
                <div className="emptyContainer">
                    <Ionicons name="cart-outline" size={60} color="#CCC" />
                    <p className="emptyText">Seu carrinho está vazio</p>
                </div>
            ) : (
                <div className="listContainer">
                    {cart.map((item) => renderItem(item))}
                </div>
            )}

            {/* Footer */}
            {cart.length > 0 && (
                <div className="footer">
                    <div className="totalContainer">
                        <span className="totalText">Total</span>
                        <span className="totalValue">
                            R$ {Number(cartTotal).toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    <button
                        className="confirmButton"
                        onClick={() => router.push('/confirmacao')}
                    >
                        <span className="confirmButtonText">
                            CONFIRMAR PEDIDO
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
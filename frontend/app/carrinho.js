import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Importa o arquivo refatorado com a const styles exportada
import { styles } from './CartScreen.styles';
import { useCart } from '../src/context/CartContext';

export default function CartScreen() {
    const router = useRouter();
    const { items: cart = [], updateQuantity, removeFromCart, cartTotal } = useCart();

    const renderItem = (item) => (
        <View style={styles.cartItem} key={item.id}>
            <Image 
                source={{ uri: item.image }} 
                style={styles.productImage} 
                resizeMode="cover"
            />
            
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.title || item.nome}</Text> 
                <Text style={styles.productPrice}>
                    R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </Text>
            </View>

            <View style={styles.actionsContainer}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, 'decrement')}
                    >
                        <Ionicons name="remove" size={16} color="#FF8200" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, 'increment')}
                    >
                        <Ionicons name="add" size={16} color="#FF8200" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.deleteBtn}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF8200" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.8} style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#222222" />
                </TouchableOpacity>

                <View style={styles.headerTitles}>
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerSubtitle}>Meu pedido</Text>
                </View>

                <View style={{ width: 24 }}></View>
            </View>

            {/* ScrollView encapsula o conteúdo dinâmico permitindo rolagem na tela inteira */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {cart.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={60} color="#CCC" />
                        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {cart.map((item) => renderItem(item))}
                    </View>
                )}
            </ScrollView>

            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalValue}>
                            R$ {Number(cartTotal).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.confirmButton}
                        onPress={() => router.push('/confirmacao')}
                    >
                        <Text style={styles.confirmButtonText}>
                            CONFIRMAR PEDIDO
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
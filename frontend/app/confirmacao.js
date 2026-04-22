import React, { useState } from 'react';
// Bibliotecas substituindo Web DOM por UI Nativa
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { useCart } from '../src/context/CartContext';

// Importação do StyleSheet externo
import { styles } from './ConfirmacaoScreen.styles';

export default function ConfirmacaoScreen() {
    const router = useRouter();
    const { items: cart = [], cartTotal, clearCart } = useCart();
    
    const [enviando, setEnviando] = useState(false);
    const [mesa, setMesa] = useState('');
    // Estado extra para gerenciar cor da borda via focus emulador do CSS
    const [isFocused, setIsFocused] = useState(false);

    const finalizarPedido = async () => {
        if (!mesa) {
            // No mobile, prefira Alert.alert ao invés do alert() global da Web
            Alert.alert('Atenção', 'Por favor, informe o número da sua mesa.');
            return; 
        }
        
        setEnviando(true);

        try {
            await addDoc(collection(db, 'pedidos'), {
                itens: cart, 
                total: cartTotal, 
                mesa: mesa, 
                status: 'pendente', 
                criadoEm: new Date() 
            });

            clearCart();
            
            Alert.alert('Sucesso', 'Pedido enviado com sucesso para a cozinha! 🎉');
            router.replace('/'); 

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            Alert.alert('Erro', 'Erro ao enviar pedido. Tente novamente.'); 
        } finally {
            setEnviando(false);
        }
    };

    // Flag pré-calculada para clareza no Disable do botão
    const isCartEmpty = cart.length === 0;

    return (
        <View style={styles.confirmContainer}>
            {/* Header Área App Top */}
            <View style={styles.confirmHeader}>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={styles.backBtn} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                
                <View>
                    <Image 
                        source={require('../assets/images/logo-pedeae.png')} 
                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                    />
                </View>
                
                <View style={{ width: 40 }}></View>
            </View>

            {/* Parte Dinâmica e Rolável com ScrollView */}
            <ScrollView contentContainerStyle={styles.confirmContent}>
                <View style={styles.confirmCard}>
                    
                    <Text style={styles.confirmTitle}>Finalizar Pedido</Text>
                    <Text style={styles.confirmSubtitle}>Confirme os detalhes e informe sua mesa</Text>

                    {/* Divs Group Input com Estilos Margings */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Número da Mesa</Text>
                        <TextInput 
                            style={[styles.mesaInput, isFocused && styles.mesaInputFocus]} // Matriz de estilos condicional
                            placeholder="Ex: 05"
                            keyboardType="number-pad" 
                            value={mesa} 
                            onChangeText={setMesa} // Mapeamento Direto do Value no RN
                            onFocus={() => setIsFocused(true)} // UI Triggers
                            onBlur={() => setIsFocused(false)}
                        />
                    </View>

                    {/* Visualização Simplificada Totalizadores */}
                    <View style={styles.resumoPedido}>
                        <Text style={styles.resumoTitle}>Resumo dos Itens</Text>
                        
                        {cart.map((item) => (
                            <View key={item.id} style={styles.resumoItem}>
                                <Text style={styles.resumoItemText}>
                                    {item.quantity}x {item.title || item.nome}
                                </Text>
                                <Text style={styles.resumoItemText}>
                                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                </Text> 
                            </View>
                        ))}
                        
                        <View style={styles.divisor}></View>
                        
                        <View style={styles.resumoTotal}>
                            <Text style={styles.resumoTotalText}>Total</Text>
                            <Text style={styles.resumoTotalText}>
                                R$ {Number(cartTotal).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons Principal */}
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[
                            styles.btnFinalizar,
                            (enviando || isCartEmpty) && styles.btnFinalizarDisabled
                        ]}
                        onPress={finalizarPedido}
                        disabled={enviando || isCartEmpty}
                    >
                        {enviando ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            // Regra de Ouro Nativa: Texto sempre na tag Text
                            <Text style={styles.btnFinalizarText}>ENVIAR PARA A COZINHA</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
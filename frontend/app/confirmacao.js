import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../src/context/CartContext';

export default function ConfirmacaoScreen() {
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();

    // Utilizar useState captura o estado inicial quando o componente monta.
    // Assim, quando clearCart() for disparado no useEffect e a Context API 
    // for atualizada, este componente re-renderizará, mas manterá o snapshot.
    const [orderItems] = useState([...cart]);
    const [orderTotal] = useState(cartTotal());

    useEffect(() => {
        // Limpa o carrinho globalmente, preservando os itens visualmente via snapshot local
        clearCart();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <Text style={styles.headerTitle}>PedeAê</Text>

                {/* Success Icon */}
                <View style={styles.successIconContainer}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark" size={60} color="#27AE60" />
                    </View>
                </View>

                {/* Messages */}
                <Text style={styles.successTitle}>Pedido Enviado!</Text>
                <Text style={styles.successSubtitle}>Seu pedido foi enviado para a cozinha.</Text>

                {/* Order Summary */}
                <Text style={styles.summaryTitle}>Resumo</Text>
                <View style={styles.summaryBox}>                    {orderItems.map((item) => (
                    <View key={item.id} style={styles.summaryItemRow}>
                        <Text style={styles.summaryItemText}>
                            {item.quantity}x | {item.name}
                        </Text>
                        <Text style={styles.summaryItemPrice}>
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                ))}
                    <View style={styles.divider} />
                    <View style={styles.summaryTotalRow}>
                        <Text style={styles.summaryTotalText}>Total</Text>
                        <Text style={styles.summaryTotalValue}>
                            R$ {orderTotal.toFixed(2).replace('.', ',')}
                        </Text>
                    </View>
                </View>

                {/* Time Box */}
                <View style={styles.timeBox}>
                    <View style={styles.timeTitleRow}>
                        <Ionicons name="time-outline" size={20} color="#777777" />
                        <Text style={styles.timeTitle}>Tempo estimado de preparo</Text>
                    </View>
                    <Text style={styles.timeValue}>15-30 min</Text>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>🔔 Chamar Garçom</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.linkButtonText}>Fazer novo pedido</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF8200',
        marginBottom: 40,
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#777777',
        textAlign: 'center',
        marginBottom: 40,
    },
    summaryTitle: {
        width: '100%',
        fontSize: 14,
        color: '#777777',
        marginBottom: 8,
        textAlign: 'left',
    },
    summaryBox: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    summaryItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryItemText: {
        fontSize: 15,
        color: '#222222',
        flex: 1,
    },
    summaryItemPrice: {
        fontSize: 15,
        color: '#777777',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: 12,
    },
    summaryTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryTotalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222222',
    },
    summaryTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF8200',
    },
    timeBox: {
        width: '100%',
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 40,
    },
    timeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeTitle: {
        fontSize: 14,
        color: '#777777',
        marginLeft: 8,
    },
    timeValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222222',
    },
    primaryButton: {
        backgroundColor: '#FF8200',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        paddingVertical: 10,
    },
    linkButtonText: {
        color: '#FF8200',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

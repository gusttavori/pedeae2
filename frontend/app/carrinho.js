import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../src/context/CartContext';

export default function CartScreen() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            </View>

            <View style={styles.actionsContainer}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, 'decrement')}
                    >
                        <Ionicons name="remove" size={16} color="#FF8200" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.id, 'increment')}
                    >
                        <Ionicons name="add" size={16} color="#FF8200" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF8200" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#222222" />
                </TouchableOpacity>
                <View style={styles.headerTitles}>
                    <Text style={styles.headerTitle}>PedeAê</Text>
                    <Text style={styles.headerSubtitle}>Meu pedido</Text>
                </View>
                <View style={{ width: 24 }} /> {/* Spacer to center title */}
            </View>

            {/* Cart List */}
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={60} color="#CCC" />
                    <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
                </View>
            ) : (
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Footer */}
            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalValue}>R$ {cartTotal().toFixed(2).replace('.', ',')}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => router.push('/confirmacao')}
                    >
                        <Text style={styles.confirmButtonText}>CONFIRMAR PEDIDO</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 5,
    },
    headerTitles: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF8200',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#777777',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#777777',
        marginTop: 10,
    },
    listContainer: {
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        padding: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#777777',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    quantityBtn: {
        padding: 4,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222222',
        marginHorizontal: 10,
    },
    deleteBtn: {
        padding: 8,
        backgroundColor: '#FFF0E0',
        borderRadius: 20,
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222222',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF8200',
    },
    confirmButton: {
        backgroundColor: '#FF8200',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

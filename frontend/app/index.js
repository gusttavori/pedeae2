import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../src/context/CartContext';

const menuItems = [
    { id: '1', name: 'Pizza Margherita', category: 'Pizzas Salgadas', description: 'Queijo, tomate e manjericão fresco', price: 45.90, image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Pizza Pepperoni', category: 'Pizzas Salgadas', description: 'Muito pepperoni e queijo mussarela', price: 64.90, image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Pizza de Chocolate', category: 'Pizzas Doces', description: 'Chocolate ao leite com morangos', price: 54.90, image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Coca-Cola 2L', category: 'Bebidas', description: 'Refrigerante gelado', price: 12.00, image: 'https://via.placeholder.com/150' },
    { id: '5', name: 'Suco de Laranja', category: 'Bebidas', description: 'Suco natural 500ml', price: 9.00, image: 'https://via.placeholder.com/150' },
];

const categories = ['Todos', 'Pizzas Salgadas', 'Pizzas Doces', 'Bebidas'];

export default function HomeScreen() {
    const router = useRouter();
    const { cart, addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredItems = selectedCategory === 'Todos'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PedeAê</Text>
                <View style={styles.storeInfo}>
                    <View style={styles.storeIconContainer}>
                        <Ionicons name="pizza-outline" size={24} color="#FFF" />
                    </View>
                    <View>
                        <Text style={styles.storeName}>Pizzaria FLXCHE</Text>
                        <Text style={styles.storeStatus}>Mesa 5 | Aberto agora</Text>
                    </View>
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.filterPill,
                                selectedCategory === category && styles.filterPillActive
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedCategory === category && styles.filterTextActive
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Product List */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB (Carrinho) */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/carrinho')}
            >
                <Ionicons name="cart" size={28} color="#FFF" />
                {cartItemsCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartItemsCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40, // For SafeArea on some devices
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF8200',
        textAlign: 'center',
        marginBottom: 20,
    },
    storeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF8200',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 4,
    },
    storeStatus: {
        fontSize: 14,
        color: '#777777',
    },
    filtersContainer: {
        paddingVertical: 10,
        marginBottom: 10,
    },
    filtersScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#FF8200',
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterPillActive: {
        backgroundColor: '#FF8200',
    },
    filterText: {
        color: '#FF8200',
        fontWeight: '600',
        fontSize: 14,
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for FAB
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
        marginRight: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 12,
        color: '#777777',
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF8200',
    },
    addButton: {
        backgroundColor: '#FF8200',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF8200',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FFFFFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF8200',
    },
    badgeText: {
        color: '#FF8200',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

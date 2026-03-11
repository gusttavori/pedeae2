import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data
const menuItems = [
    { id: '1', name: 'Pizza de Pepperoni', description: 'apimentada do salame seco e o queijo derretido...', category: 'Pizza', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Pizza Margherita', description: 'molho de tomate, mussarela fresca e manjericão...', category: 'Pizza', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Coca-Cola 2L', description: 'Refrigerante gelado para refrescar.', category: 'Bebida', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Pizza Doce de Leite', description: 'Massa fina com doce de leite e nozes.', category: 'Sobremesa', image: 'https://via.placeholder.com/150' },
];

export default function GerenciarCardapioScreen() {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text>
            </View>
            <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Principal */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cardápio</Text>
                <View style={{ width: 38 }} /> {/* Spacer */}
            </View>

            <View style={styles.content}>
                {/* Cabeçalho da Página */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Itens do Cardápio</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.addButtonText}>Novo Produto</Text>
                    </TouchableOpacity>
                </View>

                {/* Contêiner da Lista de Produtos (Card com Sombra Forte) */}
                <View style={styles.listCard}>

                    {/* Cabeçalho da Tabela */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Produto</Text>
                        <Text style={styles.tableHeaderText}>Categoria</Text>
                    </View>

                    {/* Lista de Itens */}
                    <FlatList
                        data={menuItems}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        scrollEnabled={false} // Since we're showing a fixed amount in the card usually
                    />

                    {/* Rodapé do Contêiner (Paginação) */}
                    <View style={styles.paginationFooter}>
                        <TouchableOpacity style={styles.paginationArrow}>
                            <Ionicons name="chevron-back" size={16} color="#777777" />
                            <Ionicons name="chevron-back" size={16} color="#777777" style={{ marginLeft: -8 }} />
                        </TouchableOpacity>

                        <View style={styles.scrollbarIndicator} />

                        <TouchableOpacity style={styles.paginationArrow}>
                            <Ionicons name="chevron-forward" size={16} color="#777777" />
                            <Ionicons name="chevron-forward" size={16} color="#777777" style={{ marginLeft: -8 }} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FF8200',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    iconButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        padding: 20,
        flex: 1,
    },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#222222',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF8200',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    listCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingTop: 10,
        // Sombra Forte
        shadowColor: '#000000',
        shadowOffset: { width: -5, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    tableHeaderText: {
        fontSize: 14,
        color: '#777777',
        fontWeight: '600',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    itemImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 15,
        backgroundColor: '#EFEFEF',
    },
    itemInfo: {
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 12,
        color: '#999999',
    },
    itemCategory: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222222',
    },
    paginationFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginTop: 'auto', // Pushes to the bottom of the card if space permits
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    paginationArrow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    scrollbarIndicator: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDDDDD',
        marginHorizontal: 15,
    },
});

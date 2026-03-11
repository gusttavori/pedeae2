import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const metrics = [
    { id: '1', title: 'Receita hoje', value: 'R$ 2.790,70', icon: 'cash-outline' },
    { id: '2', title: 'Pedidos hoje', value: '43', icon: 'bag-handle-outline' },
    { id: '3', title: 'Mais pedido', value: 'Pizza Pepperoni', icon: 'star-outline' },
    { id: '4', title: 'Ticket médio', value: 'R$ 64,90', icon: 'bar-chart-outline' },
];

const recentOrders = [
    { id: '03326', table: '05', items: 'Pizza Pepp...', total: 'R$ 64,90' },
    { id: '03325', table: '12', items: '2x Coca-Cola...', total: 'R$ 24,00' },
    { id: '03324', table: 'BALCÃO', items: 'Pizza Margh...', total: 'R$ 45,90' },
    { id: '03323', table: '08', items: 'Pizza Choco...', total: 'R$ 54,90' },
    { id: '03322', table: '01', items: '3x Suco de L...', total: 'R$ 27,00' },
];

export default function DashboardScreen() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Floating Menu Dropdown */}
            {isMenuOpen && (
                <View style={styles.floatingMenu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setIsMenuOpen(false);
                            router.push('/gerenciar-cardapio');
                        }}
                    >
                        <Ionicons name="list" size={20} color="#444444" />
                        <Text style={styles.menuItemText}>Gerenciar Cardápio</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                    {metrics.map((metric) => (
                        <View key={metric.id} style={styles.metricCard}>
                            <View style={styles.metricHeader}>
                                <Text style={styles.metricTitle}>{metric.title}</Text>
                                <Ionicons name={metric.icon} size={20} color="#FF8200" />
                            </View>
                            <Text style={styles.metricValue} numberOfLines={1}>{metric.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Recent Orders Table */}
                <View style={styles.tableCard}>
                    <View style={styles.tableCardHeader}>
                        <Text style={styles.tableTitle}>Pedidos Recentes</Text>
                        <TouchableOpacity>
                            <Text style={styles.tableLink}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Table Header Row */}
                    <View style={[styles.tableRow, styles.tableHeaderRow]}>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Pedido</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1 }]}>Mesa</Text>
                        <Text style={[styles.tableCellHeader, { flex: 2 }]}>Itens</Text>
                        <Text style={[styles.tableCellHeader, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
                    </View>

                    {/* Table Data Rows */}
                    {recentOrders.map((order, index) => (
                        <View
                            key={order.id}
                            style={[
                                styles.tableRow,
                                index === recentOrders.length - 1 && { borderBottomWidth: 0 }
                            ]}
                        >
                            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>{order.id}</Text>
                            <Text style={[styles.tableCell, { flex: 1 }]}>{order.table}</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{order.items}</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right', color: '#FF8200', fontWeight: 'bold' }]}>
                                {order.total}
                            </Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    floatingMenu: {
        position: 'absolute',
        top: 60,
        left: 10,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#444444',
        marginLeft: 8,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 130, 0, 0.2)', // Thin orange border
        padding: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricTitle: {
        fontSize: 13,
        color: '#777777',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222222',
    },
    tableCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    tableCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222222',
    },
    tableLink: {
        fontSize: 14,
        color: '#FF8200',
        fontWeight: '500',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        alignItems: 'center',
    },
    tableHeaderRow: {
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    tableCellHeader: {
        fontSize: 12,
        color: '#777777',
        fontWeight: 'bold',
    },
    tableCell: {
        fontSize: 13,
        color: '#222222',
    },
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    confirmContainer: {
        backgroundColor: '#F8F9FA',
        flex: 1, // Substitui min-height: 100vh garantindo tela cheia
        width: '100%',
        alignSelf: 'center',
        maxWidth: 500, // Mantido caso o app rode também em Web/Tablet pelo Expo
    },
    confirmHeader: {
        flexDirection: 'row', // O Flex default do RN é column, então forçamos row
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50, // Considera margem da barra de status
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 5,
    },
    confirmContent: {
        padding: 20,
        flexGrow: 1, // Garante que o conteúdo expanda no ScrollView
    },
    confirmCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 25,
        // Sombras Nativas Adaptadas
        elevation: 5, // Android
        shadowColor: '#000', // iOS
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 30,
    },
    confirmTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        marginBottom: 5,
    },
    confirmSubtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 25,
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    mesaInput: {
        width: '100%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    mesaInputFocus: {
        borderColor: '#FF8C00', // Classe condicional para emular o :focus nativamente
    },
    resumoPedido: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
    },
    resumoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resumoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resumoItemText: {
        fontSize: 14,
        color: '#666',
    },
    divisor: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 15, // Margem vertical simplifica margin-top e bottom
    },
    resumoTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resumoTotalText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
    },
    btnFinalizar: {
        backgroundColor: '#FF8200', // Cor solida adaptada pela falta do background-image / linear-gradient nativo
        width: '100%',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        // Sombra temática 
        elevation: 5,
        shadowColor: '#FF8200',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    btnFinalizarDisabled: {
        backgroundColor: '#CCC',
        elevation: 0,
        shadowOpacity: 0,
    },
    btnFinalizarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    }
});
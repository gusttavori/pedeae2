import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // Fundo da tela inteira
    loginContainer: {
        backgroundColor: '#F4F7F6',
        flex: 1, // Ocupa 100% da altura e largura da tela
        justifyContent: 'center', // Centraliza o card verticalmente
        alignItems: 'center', // Centraliza o card horizontalmente
        position: 'relative',
        padding: 20,
    },
    
    // Botão flutuante de voltar
    backBtnHome: {
        position: 'absolute',
        top: 40, // Espaço para a barra de status do celular
        left: 20,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        
        // Sombra leve para destacar o botão branco do fundo cinza
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },

    // O Cartão central de login (Efeito "Glass" ou Minimalista)
    loginCard: {
        backgroundColor: '#FFF',
        width: '100%',
        maxWidth: 400, // No iPad ou Web, o card não fica gigante
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderRadius: 24, // Bordas bem arredondadas para um look moderno
        
        // Sombra suave que dá a sensação de flutuação
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.05,
        shadowRadius: 35,
    },

    loginHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },

    loginTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
        textAlign: 'center',
    },

    loginSubtitle: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
    },

    loginForm: {
        gap: 20, // Espaçamento automático entre os campos (RN >= 0.71)
    },

    inputBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase', // Estilo de "Etiqueta" profissional
    marginBottom: 8,
    },

    inputBoxInput: {
        width: '100%',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 15,
        backgroundColor: '#FDFDFD',
        color: '#333',
    },

    // Notificação de Erro (Vermelho sutil)
    errorMsg: {
        backgroundColor: '#FFF0F0',
        color: '#E33E42',
        padding: 10,
        borderRadius: 8,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        overflow: 'hidden', // Necessário para o border-radius funcionar em <Text> no iOS
    },

    // Botão de ação (Laranja PedeAê)
    loginBtn: {
        backgroundColor: '#FF8200',
        padding: 16,
        borderRadius: 14,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        
        // Sombra colorida para efeito de "iluminação" no botão
        elevation: 3,
        shadowColor: '#FF8200',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },

    loginBtnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '800',
    },

    loginBtnDisabled: {
        opacity: 0.7, // Visual de "carregando"
    }
});
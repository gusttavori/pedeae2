import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones
import { useRouter } from 'expo-router'; // Gerencia a navegação entre as telas
import * as ImagePicker from 'expo-image-picker'; // Permite acessar a galeria de fotos do celular

// Funções do Firebase para adicionar um novo documento no banco de dados Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../src/config/firebase'; 

// Importa a folha de estilos nativa
import { styles } from './GerenciarCardapioScreen.styles';

// Configurações do Cloudinary (Serviço de hospedagem de imagens)
// É melhor salvar a imagem em um serviço especializado e guardar apenas o Link (URL) no Firebase.
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq4ezzeil/image/upload';
const UPLOAD_PRESET = 'pedeae_fotos'; // Pasta/Configuração criada lá no Cloudinary

export default function GerenciarCardapioScreen() {
  const router = useRouter();

  // --- ESTADOS DO FORMULÁRIO ---
  // Armazenam o que o usuário digita em cada campo
  const [nome, setNome] = useState(''); 
  const [categoria, setCategoria] = useState('Hambúrguer'); // Já vem com um valor padrão para facilitar
  const [preco, setPreco] = useState(''); 
  const [descricao, setDescricao] = useState(''); 
  const [imagemUri, setImagemUri] = useState(null); // Guarda o caminho da foto no celular do usuário
  
  // --- ESTADOS DE CONTROLE DE TELA ---
  const [salvando, setSalvando] = useState(false); // Diz se o botão de salvar deve mostrar o "giragira" (ActivityIndicator)
  const [showSuccess, setShowSuccess] = useState(false); // Controla se o aviso verde de sucesso aparece ou não

  /**
   * Abre a galeria do celular para o usuário escolher a foto do prato.
   */
  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite apenas fotos (nada de vídeos)
      allowsEditing: true, // Deixa o usuário cortar a foto antes de confirmar
      aspect: [4, 3], // Força um formato retangular padrão para todas as fotos
      quality: 0.5, // Reduz a qualidade em 50% para a imagem não ficar pesada e o upload ser rápido
    });

    // Se o usuário não cancelou a escolha, salvamos o caminho da imagem no estado
    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  /**
   * Função principal: Valida os dados, sobe a foto pro Cloudinary e salva tudo no Firebase.
   */
  const salvarProduto = async () => {
    // 1. VALIDAÇÃO BÁSICA
    // Impede que o usuário salve um produto sem nome, sem preço ou sem foto
    if (!nome || !preco || !imagemUri) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (incluindo a foto)!');
      return; // Para a execução da função aqui mesmo
    }

    setSalvando(true); // Muda o botão para o modo de carregamento

    try {
      // 2. PREPARANDO A IMAGEM PARA O CLOUDINARY
      // O React Native precisa transformar o caminho do arquivo em um "Blob" (um formato de dados puros)
      const respostaImagem = await fetch(imagemUri);
      const blob = await respostaImagem.blob();

      // Monta o "pacote" de dados que será enviado ao Cloudinary
      const data = new FormData();
      data.append('file', blob, 'foto_produto.jpg');
      data.append('upload_preset', UPLOAD_PRESET);

      // 3. ENVIANDO PARA O CLOUDINARY
      const respostaCloudinary = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      const dadosImagem = await respostaCloudinary.json();

      // Se o Cloudinary não devolver uma URL segura (secure_url), algo deu errado
      if (!dadosImagem.secure_url) {
        console.error("Erro do Cloudinary:", dadosImagem);
        throw new Error('Erro ao enviar imagem para o Cloudinary');
      }

      // 4. SALVANDO NO FIREBASE
      // Agora que temos a URL da imagem hospedada, salvamos os dados de texto no Firestore
      await addDoc(collection(db, 'produtos'), {
        nome,
        categoria,
        // Converte o preço que o usuário digitou (ex: "25,90") para um número válido no banco (25.90)
        preco: parseFloat(preco.replace(',', '.')), 
        descricao,
        imagem: dadosImagem.secure_url, // Salva APENAS O LINK da imagem
        criadoEm: new Date() // Marca a data e hora do cadastro
      });

      // 5. FEEDBACK DE SUCESSO
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // O aviso verde some sozinho após 3 segundos
      
      // 6. LIMPEZA DO FORMULÁRIO
      // Esvazia os campos para o usuário poder cadastrar um novo prato logo em seguida
      setNome('');
      setPreco('');
      setDescricao('');
      setImagemUri(null);

    } catch (error) {
      console.error("Erro no catch:", error);
      Alert.alert('Erro', 'Falha ao salvar. Verifique o console para mais detalhes.');
    } finally {
      // Independentemente de dar certo ou errado, tira o botão do modo de carregamento
      setSalvando(false);
    }
  };

  return (
    <View style={styles.adminContainer}>
      
      {/* TOAST DE SUCESSO (Renderização Condicional) */}
      {/* Só aparece na tela se a variável showSuccess for verdadeira */}
      {showSuccess && (
        <View style={styles.successToast}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.successToastText}>Produto adicionado com sucesso!</Text>
        </View>
      )}

      {/* CABEÇALHO */}
      <View style={styles.adminHeader}>
        {/* Botão de voltar */}
        <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={() => router.push('/admin/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        
        <View style={styles.headerText}>
          <Text style={styles.pageTitle}>Cardápio</Text>
          <Text style={styles.pageSubtitle}>Novo Item</Text>
        </View>
        
        {/* Truque visual: Uma view vazia com a mesma largura do botão de voltar (40px)
            Isso garante que os textos do meio fiquem perfeitamente centralizados na tela */}
        <View style={{ width: 40 }}></View>
      </View>

      {/* ÁREA COM ROLAGEM */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.adminContent}>
          <View style={styles.formCard}>
            
            <Text style={styles.inputLabel}>Imagem do Produto</Text>
            
            {/* CAIXA DE UPLOAD DE IMAGEM */}
            <TouchableOpacity activeOpacity={0.8} style={styles.uploadBox} onPress={escolherImagem}>
              {/* Se o usuário já escolheu uma imagem, mostra ela. Se não, mostra o ícone de câmera. */}
              {imagemUri ? (
                <Image source={{ uri: imagemUri }} style={styles.imgPreview} resizeMode="cover" />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#FF8C00" />
                  <Text style={styles.uploadPlaceholderText}>Escolher Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* CAMPO: NOME DO PRODUTO */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Nome do Produto</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ex: Cheese Bacon" 
                placeholderTextColor="#999999"
                value={nome} 
                onChangeText={setNome} 
              />
            </View>

            {/* LINHA COM DOIS CAMPOS LADO A LADO: CATEGORIA E PREÇO */}
            <View style={styles.inputRow}>
              
              {/* CAMPO: CATEGORIA (Ocupa mais espaço - flex 2) */}
              <View style={[styles.inputGroup, styles.flex2]}>
                <Text style={styles.inputGroupLabel}>Categoria</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Ex: Hambúrguer"
                  placeholderTextColor="#999999"
                  value={categoria} 
                  onChangeText={setCategoria} 
                />
              </View>

              {/* CAMPO: PREÇO (Ocupa menos espaço - flex 1) */}
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputGroupLabel}>Preço (R$)</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="0,00" 
                  placeholderTextColor="#999999"
                  keyboardType="numeric" // Abre o teclado numérico do celular para facilitar a vida do usuário
                  value={preco} 
                  onChangeText={setPreco} 
                />
              </View>
            </View>

            {/* CAMPO: DESCRIÇÃO */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Descrição / Ingredientes</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                multiline={true} // Transforma o input comum em uma caixa de texto grande
                numberOfLines={4}
                placeholder="Descreva o que vem no prato..."
                placeholderTextColor="#999999"
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            {/* BOTÃO DE CADASTRAR */}
            <TouchableOpacity 
              activeOpacity={0.8}
              // Se estiver salvando, aplica um estilo extra de botão desabilitado (mais transparente)
              style={[styles.btnSalvar, salvando && styles.btnSalvarDisabled]} 
              onPress={salvarProduto} 
              disabled={salvando} // Impede que o usuário clique 2x e envie o mesmo prato em duplicidade
            >
              {/* Se estiver salvando, mostra o indicador de carregamento. Se não, mostra o texto. */}
              {salvando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnSalvarText}>CADASTRAR PRODUTO</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
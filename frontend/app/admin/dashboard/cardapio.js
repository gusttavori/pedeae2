import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Firebase
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../src/config/firebase'; 

// CSS Separado
import './cardapio.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq4ezzeil/image/upload';
const UPLOAD_PRESET = 'pedeae_fotos';

export default function GerenciarCardapioScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Hambúrguer');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagemUri, setImagemUri] = useState(null);
  
  const [salvando, setSalvando] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Estado para o alerta visual

  const escolherImagem = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, 
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const salvarProduto = async () => {
    if (!nome || !preco || !imagemUri) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setSalvando(true);

    try {
      const respostaImagem = await fetch(imagemUri);
      const blob = await respostaImagem.blob();

      const data = new FormData();
      data.append('file', blob, 'foto_produto.jpg');
      data.append('upload_preset', UPLOAD_PRESET);

      const respostaCloudinary = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      const dadosImagem = await respostaCloudinary.json();

      if (!dadosImagem.secure_url) throw new Error('Erro no Cloudinary');

      await addDoc(collection(db, 'produtos'), {
        nome,
        categoria,
        preco: parseFloat(preco.replace(',', '.')), 
        descricao,
        imagem: dadosImagem.secure_url,
        criadoEm: new Date()
      });

      // DISPARA ALERTA VISUAL
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Some após 3 segundos
      
      // Limpa os campos
      setNome('');
      setPreco('');
      setDescricao('');
      setImagemUri(null);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="adminContainer">
      {/* ALERTA VISUAL DE SUCESSO */}
      {showSuccess && (
        <div className="successToast">
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <span>Produto adicionado com sucesso!</span>
        </div>
      )}

      <header className="adminHeader">
        <button className="backBtn" onClick={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </button>
        <div className="headerText">
          <span className="pageTitle">Cardápio</span>
          <span className="pageSubtitle">Novo Item</span>
        </div>
        <div style={{ width: 40 }}></div>
      </header>

      <main className="adminContent">
        <div className="formCard">
          <label className="inputLabel">Imagem do Produto</label>
          <button className="uploadBox" onClick={escolherImagem}>
            {imagemUri ? (
              <img src={imagemUri} className="imgPreview" alt="Preview" />
            ) : (
              <div className="uploadPlaceholder">
                <Ionicons name="camera-outline" size={40} color="#FF8C00" />
                <span>Escolher Foto</span>
              </div>
            )}
          </button>

          <div className="inputGroup">
            <label>Nome do Produto</label>
            <input 
              placeholder="Ex: Cheese Bacon" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
            />
          </div>

          <div className="inputRow">
            <div className="inputGroup flex2">
              <label>Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Hambúrguer">Hambúrguer</option>
                <option value="Acompanhamentos">Acompanhamentos</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sobremesas">Sobremesas</option>
              </select>
            </div>

            <div className="inputGroup flex1">
              <label>Preço (R$)</label>
              <input 
                placeholder="0,00" 
                type="number" 
                value={preco} 
                onChange={(e) => setPreco(e.target.value)} 
              />
            </div>
          </div>

          <div className="inputGroup">
            <label>Descrição / Ingredientes</label>
            <textarea 
              rows="4" 
              placeholder="Descreva o que vem no prato..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <button 
            className="btnSalvar" 
            onClick={salvarProduto} 
            disabled={salvando}
          >
            {salvando ? <ActivityIndicator color="#FFF" /> : "CADASTRAR PRODUTO"}
          </button>
        </div>
      </main>
    </div>
  );
}
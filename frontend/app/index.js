import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Firebase e Contexto
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { useCart } from '../src/context/CartContext';

import './index.css';

const CATEGORIAS = ["Todos", "Hambúrguer", "Acompanhamentos", "Bebidas", "Sobremesas"];

export default function HomeScreen() {
  const router = useRouter();
  const { items, addItem } = useCart();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const produtosFiltrados = categoriaAtiva === "Todos" 
    ? produtos 
    : produtos.filter(p => p.categoria === categoriaAtiva);

  return (
    <div className="homeContainer">
      <StatusBar style="dark" />

      <header className="homeHeader">
        <div className="headerBrandContainer">
          <Image 
            source={require('../assets/images/logo-pedeae.png')} 
            style={{ width: 120, height: 40, resizeMode: 'contain' }}
          />
        </div>

        <button className="cartBtn" onClick={() => router.push('/carrinho')}>
          <Ionicons name="cart-outline" size={26} color="#333" />
          {items?.length > 0 && <div className="badge">{items.length}</div>}
        </button>
      </header>

      {/* Categorias */}
      <div className="categoryScroll">
        {CATEGORIAS.map((cat) => (
          <button 
            key={cat}
            className={`categoryItem ${categoriaAtiva === cat ? 'categoryItemActive' : ''}`}
            onClick={() => setCategoriaAtiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Produtos */}
      {loading ? (
        <div className="center">Carregando cardápio...</div>
      ) : (
        <div className="productList">
          {produtosFiltrados.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                className={`productCard ${isExpanded ? 'cardExpanded' : ''}`} 
                key={item.id}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <img src={item.imagem} className="prodImg" alt={item.nome} />
                <div className="prodInfo">
                  <div>
                    <h3 className="prodTitle">{item.nome}</h3>
                    <p className={`prodDesc ${isExpanded ? 'descVisible' : 'descHidden'}`}>
                      {item.descricao}
                    </p>
                  </div>
                  <div className="priceRow">
                    <span className="prodPrice">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</span>
                    <button className="addBtn" onClick={(e) => {
                      e.stopPropagation();
                      addItem({ id: item.id, title: item.nome, price: item.preco, image: item.imagem });
                    }}>
                      <Ionicons name="add" size={20} color="#FFF" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botão Admin - Ele tenta ir pro dashboard, mas o _layout.js DEVE interceptar se não estiver logado */}
      <button className="adminFab" onClick={() => router.push('/admin/dashboard')}>
        <Ionicons name="settings-outline" size={22} color="#FFF" />
      </button>
    </div>
  );
}
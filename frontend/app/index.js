import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { useCart } from '../src/context/CartContext';

// Importação do StyleSheet nativo que acabamos de criar
import { styles } from './index.styles';

const CATEGORIAS = ["Todos", "Hambúrguer", "Acompanhamentos", "Bebidas", "Sobremesas"];

export default function HomeScreen() {
  const router = useRouter();
  const { items, addItem } = useCart();
  
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [expandedId, setExpandedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showHelpToast, setShowHelpToast] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setProdutos(lista);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const produtosFiltrados = categoriaAtiva === "Todos" 
    ? produtos 
    : produtos.filter(p => p.categoria === categoriaAtiva);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E0E0E0' }}>
      <View style={styles.homeContainer}>
        <StatusBar style="dark" />

        {/* CABEÇALHO */}
        <View style={styles.homeHeader}>
          <View style={styles.headerBrandContainer}>
            <Image 
              source={require('../assets/images/logo-pedeae.png')} 
              style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
          </View>

          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/carrinho')} activeOpacity={0.7}>
            <Ionicons name="cart-outline" size={26} color="#333" />
            {items?.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{items.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* FILTRO DE CATEGORIAS */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIAS.map((cat) => {
              const isActive = categoriaAtiva === cat;
              return (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryItem, isActive && styles.categoryItemActive]}
                  onPress={() => setCategoriaAtiva(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* LISTA DE PRODUTOS */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF8C00" />
            <Text style={styles.centerText}>Carregando cardápio...</Text>
          </View>
        ) : ( 
          <ScrollView contentContainerStyle={styles.productList} showsVerticalScrollIndicator={false}>
            {produtosFiltrados.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <TouchableOpacity 
                  key={item.id}
                  style={[styles.productCard, isExpanded && styles.cardExpanded]} 
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: item.imagem }} style={styles.prodImg} />
                  
                  <View style={styles.prodInfo}>
                    <View>
                      <Text style={styles.prodTitle}>{item.nome}</Text>
                      <Text 
                        style={styles.prodDesc} 
                        numberOfLines={isExpanded ? undefined : 2}
                      >
                        {item.descricao}
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.prodPrice}>
                        R$ {Number(item.preco).toFixed(2).replace('.', ',')}
                      </Text>
                      
                      <TouchableOpacity 
                        style={styles.addBtn} 
                        activeOpacity={0.7}
                        onPress={() => {
                          addItem({ id: item.id, title: item.nome, price: item.preco, image: item.imagem });
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 2500);
                        }}
                      >
                        <Ionicons name="add" size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* BOTÕES FLUTUANTES (FABs) */}
        <TouchableOpacity 
          style={styles.helpFab} 
          activeOpacity={0.8}
          onPress={() => {
            setShowHelpToast(true);
            setTimeout(() => setShowHelpToast(false), 3500);
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFF" /> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.adminFab} 
          activeOpacity={0.8}
          onPress={() => router.push('/admin/dashboard')}
        >
          <Ionicons name="lock-closed-outline" size={22} color="#FFF" /> 
        </TouchableOpacity>

        {/* TOASTS (NOTIFICAÇÕES) */}
        {showToast && (
          <View style={styles.toastAlert}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.toastText}>Adicionado ao carrinho</Text>
          </View>
        )}

        {showHelpToast && (
          <View style={styles.toastAlert}>
            <Ionicons name="notifications" size={20} color="#FF8C00" />
            <Text style={styles.toastText}>Garçom a caminho da mesa!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
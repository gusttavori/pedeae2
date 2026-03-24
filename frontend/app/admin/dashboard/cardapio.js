// Importa o React e o hook de estado
import React, { useState } from 'react';
// Importa ícones vetoriais compatíveis com o Expo
import { Ionicons } from '@expo/vector-icons';
// Importa o hook para navegação de telas
import { useRouter } from 'expo-router';
// Importa componentes visuais e de alerta nativos
import { Image, ActivityIndicator, Alert } from 'react-native';
// Importa o módulo do Expo para selecionar imagens da galeria
import * as ImagePicker from 'expo-image-picker';

// Importa funções do Firestore para gerenciar banco de dados
import { collection, addDoc } from 'firebase/firestore';
// Importa nossa conexão inicializada com o banco
import { db } from '../../../src/config/firebase'; 

// Importa o arquivo de folha de estilos
import './cardapio.css';

// URL da API Cloudinary para realizar o upload das fotos
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq4ezzeil/image/upload';
// Constante que identifica o preset de upload no Cloudinary
const UPLOAD_PRESET = 'pedeae_fotos';

// Define e exporta a tela de gerenciamento de itens no cardápio
export default function GerenciarCardapioScreen() {
  // Inicializa o roteador de navegação
  const router = useRouter();

  // Cria estados para cada campo do formulário de produto
  const [nome, setNome] = useState(''); // Nome do lanche
  const [categoria, setCategoria] = useState('Hambúrguer'); // Categoria padrão
  const [preco, setPreco] = useState(''); // Valor monetário
  const [descricao, setDescricao] = useState(''); // Ingredientes/detalhes
  const [imagemUri, setImagemUri] = useState(null); // Caminho local da foto escolhida
  
  // Estado para indicar quando está processando o salvamento no banco
  const [salvando, setSalvando] = useState(false);
  // Estado para exibir ou esconder o aviso de sucesso momentâneo
  const [showSuccess, setShowSuccess] = useState(false); 

  // Função assíncrona para abrir a galeria e escolher uma foto
  const escolherImagem = async () => {
    // Abre a biblioteca de imagens aplicando restrições de corte
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true, // Permite que o usuário corte a imagem
      aspect: [4, 3], // Define a proporção obrigatória do corte
      quality: 0.5, // Reduz a qualidade da imagem para otimizar tamanho
    });

    // Se o usuário não cancelar a escolha
    if (!result.canceled) {
      // Salva o caminho local da imagem escolhida no estado correspondente
      setImagemUri(result.assets[0].uri);
    }
  };

  // Função assíncrona responsável por enviar o produto ao banco e imagem à nuvem
  const salvarProduto = async () => {
    // Avalia se as informações essenciais foram preenchidas
    if (!nome || !preco || !imagemUri) {
      // Retorna uma notificação em caixa de diálogo e encerra execução
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    // Liga o efeito visual de carregamento (botão desativado)
    setSalvando(true);

    // Bloco que tenta executar salvamento (pode dar erro de rede)
    try {
      // Obtém os dados brutos (Blob) do arquivo de foto que selecionamos
      const respostaImagem = await fetch(imagemUri);
      const blob = await respostaImagem.blob();

      // Monta os dados de formulário exigidos pela API de upload em nuvem
      const data = new FormData();
      data.append('file', blob, 'foto_produto.jpg');
      data.append('upload_preset', UPLOAD_PRESET);

      // Despacha um POST para jogar a foto no Cloudinary
      const respostaCloudinary = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      // Aguarda e interpreta a resposta json do servidor
      const dadosImagem = await respostaCloudinary.json();

      // Força um erro se a URL segura da foto não foi gerada
      if (!dadosImagem.secure_url) throw new Error('Erro no Cloudinary');

      // Envia todos os dados como um novo documento na coleção "produtos" do Firebase
      await addDoc(collection(db, 'produtos'), {
        nome,
        categoria,
        // Converte o preço formatado (com vírgula) para decimal numérico do Javascript
        preco: parseFloat(preco.replace(',', '.')), 
        descricao,
        imagem: dadosImagem.secure_url, // Salva o link final da imagem já nuvem
        criadoEm: new Date() // Sela com a data de criação
      });

      // Operações deram certo, ativa visualmente a mensagem de sucesso
      setShowSuccess(true);
      // Apaga o pop-up logo após 3 segundos
      setTimeout(() => setShowSuccess(false), 3000); 
      
      // Reseta todos os campos do formulário aos padrões brancos para novos envios
      setNome('');
      setPreco('');
      setDescricao('');
      setImagemUri(null);

    // Interceptador para caso o fetch, cloudinary, ou firebase falhar
    } catch (error) {
      // Informa no canal técnico do navegador/celular o console do erro
      console.error(error);
      // Dispara o alerta padrão do sistema avisando do erro
      Alert.alert('Erro', 'Falha ao salvar. Tente novamente.');
    } finally {
      // Independente de dar sucesso ou erro, destrava a tela/botão voltando pro falso
      setSalvando(false);
    }
  };

  // Renderiza a casca e campos da tela pra inserir as coisas
  return (
    // Invólucro master do administrador CSS
    <div className="adminContainer">
      {/* Container visual que se exibe com o check de sucesso (Renderização Condicional Múltipla) */}
      {showSuccess && (
        <div className="successToast">
          {/* Símbolo do Certo do Ionicons */}
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <span>Produto adicionado com sucesso!</span>
        </div>
      )}

      {/* Caixa de topo com o botão de voltar e título da página */}
      <header className="adminHeader">
        {/* Aciona a navegação voltando ao item anterior da pilha router */}
        <button className="backBtn" onClick={() => router.back()}>
          {/* Simbolo estático do Ionicons */}
          <Ionicons name="arrow-back" size={24} color="#333" />
        </button>
        {/* Informações centrais texto para indicar as opções atuais */}
        <div className="headerText">
          <span className="pageTitle">Cardápio</span>
          <span className="pageSubtitle">Novo Item</span>
        </div>
        {/* Spacer falso/invisível afim de balancear o Flexbox justify control */}
        <div style={{ width: 40 }}></div>
      </header>

      {/* Área livre contendo controles para os estados e funções descritas acima */}
      <main className="adminContent">
        {/* Cartão de plano de fundo branco pros formulários */}
        <div className="formCard">
          {/* Etiqueta semiótica descritiva */}
          <label className="inputLabel">Imagem do Produto</label>
          {/* Caixa grande atuando de botão de input das imagens para galeria */}
          <button className="uploadBox" onClick={escolherImagem}>
            {/* Expressão operadora Ternária avaliando pré-vizualizações fotográficas */}
            {imagemUri ? (
              // Se possuímos um endereço local renderizamos a pre visualização dela mesma
              <img src={imagemUri} className="imgPreview" alt="Preview" />
            ) : (
              // Se a varável é `null`, exibimos de forma cinzenta onde clica a câmera 
              <div className="uploadPlaceholder">
                {/* Símbolo ilustrativo Ionicons com contorno laranja */}
                <Ionicons name="camera-outline" size={40} color="#FF8C00" />
                <span>Escolher Foto</span>
              </div>
            )}
          </button>

          {/* Wrapper comum para uma label combinada a uma Input normal para nomes textuais */}
          <div className="inputGroup">
            <label>Nome do Produto</label>
            <input 
              placeholder="Ex: Cheese Bacon" 
              value={nome} // Relaciona o DOM virtual a nossa variável
              onChange={(e) => setNome(e.target.value)} // Responde a todo key press alterando e persistindo state manager
            />
          </div>

          {/* Wrapper flex em alinhamento linha (side-by-side div layouting) */}
          <div className="inputRow">
            {/* Segmento combinando inputs e que ocupa proporção peso dupla (flex2) */}
            <div className="inputGroup flex2">
              <label>Categoria</label>
              {/* Select para restritividade de dados a banco (Categorias Fatoriais/Preestabelecidas) */}
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="Hambúrguer">Hambúrguer</option>
                <option value="Acompanhamentos">Acompanhamentos</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sobremesas">Sobremesas</option>
              </select>
            </div>

            {/* Segmento combinando inputs numéricos de peso tamanho normal relativo (flex1) */}
            <div className="inputGroup flex1">
              <label>Preço (R$)</label>
              <input 
                placeholder="0,00" 
                type="number" // Restringe nativamente caracteres aceitos limitandos ao numPad virtual smartPhone
                value={preco} 
                onChange={(e) => setPreco(e.target.value)} 
              />
            </div>
          </div>

          {/* Segmento que lida com textos multi-linhas (comentários longos) */}
          <div className="inputGroup">
            <label>Descrição / Ingredientes</label>
            <textarea 
              rows="4" // Cria uma caixa já ocupando altura inicial pra dar feedback de multilinhas melhor
              placeholder="Descreva o que vem no prato..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Acionador de submissão aos controladores assíncronos principais Cloudinary / Cloud Firestore */}
          <button 
            className="btnSalvar" 
            onClick={salvarProduto} 
            disabled={salvando} // Bloqueia cliques duplos acidentais caso boolean for true
          >
            {/* Efeito Condicional Ternário se carregando gera circulos iterators em lugar do label hardcodado "CADASTRAR" */}
            {salvando ? <ActivityIndicator color="#FFF" /> : "CADASTRAR PRODUTO"}
          </button>
        </div>
      </main>
    </div>
  );
}
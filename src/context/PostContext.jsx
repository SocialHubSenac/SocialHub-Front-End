// context/PostContext.js
import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

// Dados iniciais simulados
const initialPosts = [
  {
    id: 1,
    titulo: "Primeira postagem",
    conteudo: "Conteúdo da primeira postagem de exemplo",
    instituicaoNome: "Instituição Exemplo",
    autor: "João Silva",
    usuarioId: 1,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 2,
    titulo: "Segunda postagem",
    conteudo: "Outra postagem de exemplo para testar o feed",
    instituicaoNome: "Outra Instituição",
    autor: "Maria Santos",
    usuarioId: 2,
    dataCriacao: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
  }
];

export const PostProvider = ({ children }) => {
  const [postagens, setPostagens] = useState(initialPosts);

  const adicionarPostagem = (novaPostagem) => {
    const postagemComId = {
      ...novaPostagem,
      id: Date.now() + Math.random(), // ID único simples
      dataCriacao: new Date().toISOString()
    };
    
    setPostagens(prevPostagens => [postagemComId, ...prevPostagens]);
    return postagemComId;
  };

  const editarPostagem = (id, dadosAtualizados) => {
    setPostagens(prevPostagens => 
      prevPostagens.map(postagem => 
        postagem.id === id 
          ? { ...postagem, ...dadosAtualizados, dataEdicao: new Date().toISOString() }
          : postagem
      )
    );
  };

  const excluirPostagem = (id) => {
    setPostagens(prevPostagens => 
      prevPostagens.filter(postagem => postagem.id !== id)
    );
  };

  const buscarPostagemPorId = (id) => {
    return postagens.find(postagem => postagem.id === id);
  };

  const buscarPostagens = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return postagens;
  };

  return (
    <PostContext.Provider value={{
      postagens,
      adicionarPostagem,
      editarPostagem,
      excluirPostagem,
      buscarPostagemPorId,
      buscarPostagens
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext deve ser usado dentro de PostProvider');
  }
  return context;
};
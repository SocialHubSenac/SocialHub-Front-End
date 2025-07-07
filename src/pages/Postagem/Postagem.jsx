import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePostContext } from '../../context/PostContext'; // Importa o contexto
import { AuthContext } from '../../context/AuthContext'; // Importa o contexto de autenticação

function Postagem() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { adicionarPostagem, editarPostagem, buscarPostagemPorId } = usePostContext();
  const { usuario } = useContext(AuthContext); // Obtém o usuário atual do contexto
  
  // Verifica se está editando uma postagem
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega os dados da postagem se estiver editando
  useEffect(() => {
    if (isEditing && editId) {
      const postagem = buscarPostagemPorId(Number(editId));
      if (postagem) {
        setTitulo(postagem.titulo || '');
        setConteudo(postagem.conteudo || '');
      } else {
        setMensagem('Postagem não encontrada.');
        setTipoMensagem('erro');
      }
    }
  }, [isEditing, editId, buscarPostagemPorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conteudo.trim()) {
      setMensagem('Por favor, escreva algo para publicar.');
      setTipoMensagem('erro');
      return;
    }

    if (!usuario || !usuario.id) {
      setMensagem('Usuário não encontrado. Faça login novamente.');
      setTipoMensagem('erro');
      return;
    }

    setLoading(true);
    setMensagem('');

    try {
      // Simula o delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dadosPostagem = {
        titulo: titulo.trim() || 'Publicação',
        conteudo: conteudo.trim(),
        usuarioId: usuario?.id,
        instituicaoId: usuario?.instituicaoId,
        instituicaoNome: usuario?.instituicaoNome || 'Organização',
        autor: usuario?.nome || 'Usuário Anônimo'
      };

      if (isEditing) {
        // Edita a postagem existente
        editarPostagem(Number(editId), dadosPostagem);
        setMensagem('Postagem editada com sucesso!');
        console.log('Postagem editada:', dadosPostagem);
      } else {
        // Adiciona uma nova postagem
        const novaPostagem = adicionarPostagem(dadosPostagem);
        setMensagem('Postagem criada com sucesso!');
        console.log('Postagem criada:', novaPostagem);
      }

      setTipoMensagem('sucesso');
      
      if (!isEditing) {
        setTitulo('');
        setConteudo('');
      }

      // Aguarda um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/home');
      }, 1500);

    } catch (error) {
      console.error('Erro ao processar postagem:', error);

      let mensagemErro = 'Erro inesperado. Tente novamente.';

      if (error.response) {
        mensagemErro =
          error.response.data?.message ||
          `Erro ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        mensagemErro = 'Erro de conexão. Verifique sua internet.';
      }

      setMensagem(mensagemErro);
      setTipoMensagem('erro');
    } finally {
      setLoading(false);
    }
  };

  const handleConteudoChange = (e) => {
    const valor = e.target.value;
    setConteudo(valor);

    if (mensagem && tipoMensagem === 'erro') {
      setMensagem('');
      setTipoMensagem('');
    }
  };

  const isFormValid = conteudo.trim().length > 0;

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: '#333',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '700px',
        width: '95%',
        margin: '2rem auto',
        background: '#ffffff',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        minHeight: '500px',
        position: 'relative',
        animation: 'slideIn 0.6s ease-out'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c)',
          borderRadius: '16px 16px 0 0'
        }}></div>

        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2c3e50',
          marginBottom: '2rem',
          textAlign: 'center',
          position: 'relative',
          paddingBottom: '1rem'
        }}>
          {isEditing ? 'Editar Publicação' : 'Nova Publicação'}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #3498db, #2ecc71)',
            borderRadius: '2px'
          }}></div>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <input
            type="text"
            placeholder="Título da publicação (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            disabled={loading}
            style={{
              padding: '1rem 1.2rem',
              border: '2px solid #e1e8ed',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '500',
              background: '#f8f9fa',
              color: '#2c3e50',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              width: '100%',
              outline: 'none'
            }}
          />

          <textarea
            placeholder="Escreva algo para compartilhar com a comunidade..."
            value={conteudo}
            onChange={handleConteudoChange}
            required
            maxLength={1000}
            disabled={loading}
            rows={6}
            style={{
              padding: '1.2rem',
              border: '2px solid #e1e8ed',
              borderRadius: '12px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              background: '#f8f9fa',
              color: '#2c3e50',
              resize: 'vertical',
              minHeight: '150px',
              lineHeight: '1.6',
              transition: 'all 0.3s ease',
              width: '100%',
              outline: 'none'
            }}
          />

          <div style={{
            textAlign: 'right',
            fontSize: '0.9rem',
            color: conteudo.length > 900 ? '#e74c3c' : '#7f8c8d',
            marginTop: '-0.5rem',
            fontWeight: conteudo.length > 900 ? '600' : '500'
          }}>
            {conteudo.length}/1000 caracteres
          </div>

          {/* Mostrar informações do usuário que está criando a postagem */}
          {usuario && (
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              <strong>Publicando como:</strong> {usuario.nome || 'Usuário Anônimo'}
              {usuario.instituicaoNome && (
                <span> • {usuario.instituicaoNome}</span>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            style={{
              padding: '1rem 2rem',
              background: loading || !isFormValid ? '#95a5a6' : 'linear-gradient(135deg, #3498db 0%, #2ecc71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              alignSelf: 'center',
              minWidth: '160px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: loading || !isFormValid ? 'none' : '0 2px 10px rgba(52, 152, 219, 0.2)'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '3px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  display: 'inline-block',
                  marginRight: '0.5rem'
                }}></span>
                {isEditing ? 'Salvando...' : 'Publicando...'}
              </>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Publicar'
            )}
          </button>

          {mensagem && (
            <div style={{
              padding: '1rem 1.2rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '500',
              marginTop: '1rem',
              animation: 'fadeIn 0.4s ease-out',
              background: tipoMensagem === 'sucesso' ? '#d4edda' : '#f8d7da',
              color: tipoMensagem === 'sucesso' ? '#155724' : '#721c24',
              border: tipoMensagem === 'sucesso' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
            }}>
              {mensagem}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Postagem;
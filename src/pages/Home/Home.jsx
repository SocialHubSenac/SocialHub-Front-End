import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { usePostContext } from "../../context/PostContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import './Home.css';

function LoadingSpinner() {
  return <div className="spinner"></div>;
}

function PostItem({ id, titulo, conteudo, autor, data, onEdit, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <article className="post-item">
      <div className="post-header">
        <p><strong>{titulo || 'Publicação'}</strong></p>
        <div className="post-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(id)}
            title="Editar postagem"
            disabled={isDeleting}
          >
            ✏️
          </button>
          <button 
            className="delete-btn"
            onClick={() => setShowConfirmDelete(true)}
            title="Excluir postagem"
            disabled={isDeleting}
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
      
      <p>{conteudo}</p>
      
      <small>
        Publicado por: {autor || 'Usuário'} • {data}
      </small>

      {showConfirmDelete && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-content">
            <p>Tem certeza que deseja excluir esta postagem?</p>
            <div className="confirm-delete-actions">
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </button>
              <button 
                className="cancel-delete-btn"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Home() {
  const { logout, tipoUsuario, usuario } = useContext(AuthContext);
  const { buscarPostagens, excluirPostagem } = usePostContext();
  const navigate = useNavigate();

  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchPostagens();
  }, []);

  async function fetchPostagens() {
    try {
      setLoading(true);
      setErro('');
      const postagensData = await buscarPostagens();
      setPostagens(postagensData);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
      setErro('Erro inesperado ao carregar postagens.');
    } finally {
      setLoading(false);
    }
  }

  const handleNovaPostagem = () => {
    navigate('/nova-postagem');
  };

  const handleEditarPostagem = (id) => {
    navigate(`/nova-postagem?edit=${id}`);
  };

  const handleExcluirPostagem = async (id) => {
    try {
      excluirPostagem(id);
      // Atualiza a lista local removendo a postagem
      setPostagens(prevPostagens => 
        prevPostagens.filter(postagem => postagem.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      setErro('Erro ao excluir postagem. Tente novamente.');
    }
  };

  const getUserDisplayName = () => {
    if (usuario?.nome) return usuario.nome;
    if (usuario?.email) return usuario.email;
    return 'Usuário';
  };

  const getUserTypeDisplay = () => {
    switch (tipoUsuario) {
      case 'ADMIN': return 'Administrador';
      case 'ONG': return 'Organização';
      case 'USER': return 'Usuário';
      case 'USUARIO': return 'Usuário';
      default: return tipoUsuario || 'Usuário';
    }
  };

  // Função para verificar se o usuário pode criar postagens
  const canCreatePost = () => {
    return tipoUsuario === 'ADMIN' || tipoUsuario === 'ONG' || tipoUsuario === 'USER';
  };

  return (
    <div className="home-container">
      <header className="header-bar">
        <h1>SocialHub</h1>
        <div className="user-info">
          <span>Bem-vindo, {getUserDisplayName()}</span>
          <span>{getUserTypeDisplay()}</span>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Navegação</h3>
            <div className="sidebar-buttons">
              {canCreatePost() && (
                <button className="primary" onClick={handleNovaPostagem}>
                  Criar Postagem
                </button>
              )}
              
              <button onClick={() => navigate('/perfil')}>
                Meu Perfil
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Sistema</h3>
            <div className="sidebar-buttons">
              <button className="danger" onClick={logout}>
                Sair do Sistema
              </button>
            </div>
          </div>
        </aside>

        <section className="feed-area">
          <div className="feed-container">
            <div className="feed-header">
              <h2>Feed de Publicações</h2>
              <p>Acompanhe as últimas publicações da plataforma</p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : erro ? (
              <div className="erro-mensagem">
                <p>{erro}</p>
                <button onClick={fetchPostagens}>
                  Tentar Novamente
                </button>
              </div>
            ) : postagens.length === 0 ? (
              <div className="empty-message">
                <p>Nenhuma publicação encontrada.</p>
                <p>Seja o primeiro a publicar algo!</p>
              </div>
            ) : (
              postagens.map((pub) => (
                <PostItem
                  key={pub.id}
                  id={pub.id}
                  titulo={pub.titulo}
                  conteudo={pub.conteudo}
                  autor={pub.autor || 'Usuário'}
                  data={formatDistanceToNow(
                    new Date(pub.dataCriacao),
                    { locale: ptBR, addSuffix: true }
                  )}
                  onEdit={handleEditarPostagem}
                  onDelete={handleExcluirPostagem}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
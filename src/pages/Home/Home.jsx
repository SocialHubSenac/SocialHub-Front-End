import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import './Home.css';

function LoadingSpinner() {
    return <div className="spinner"></div>;
}

function PostItem({ titulo, conteudo, autor, data }) {
    return (
        <article className="post-item">
            <p><strong>{titulo || 'Publicação'}</strong></p>
            <p>{conteudo}</p>
            <small>
                Publicado por: {autor || 'Usuário'} • {data}
            </small>
        </article>
    );
}

function Home() {
    const { logout, tipoUsuario, usuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const irParaPostagem = () => {
        navigate("/postar");
    };

    const irParaPerfil = () => {
        navigate("/perfil");
    };

    useEffect(() => {
        async function fetchPostagens() {
            try {
                setLoading(true);
                setErro('');
                
                const response = await api.get('/postagens');
                console.log('Dados recebidos:', response.data);
                
                if (Array.isArray(response.data)) {
                    setPostagens(response.data);
                } else if (response.data && Array.isArray(response.data.data)) {
                    setPostagens(response.data.data);
                } else {
                    console.warn('Formato de dados inesperado:', response.data);
                    setPostagens([]);
                }
            } catch (error) {
                console.error("Erro ao buscar postagens:", error);
                
                if (error.response) {
                    setErro(`Erro ${error.response.status}: ${error.response.data.message || 'Erro no servidor'}`);
                } else if (error.request) {
                    setErro('Erro de conexão. Verifique sua internet.');
                } else {
                    setErro('Erro inesperado ao carregar postagens.');
                }
            } finally {
                setLoading(false);
            }
        }
        
        fetchPostagens();
    }, []);

    const getUserDisplayName = () => {
        if (usuario?.nome) return usuario.nome;
        if (usuario?.email) return usuario.email;
        return 'Usuário';
    };

    const getUserTypeDisplay = () => {
        switch (tipoUsuario) {
            case 'ADMIN':
                return 'Administrador';
            case 'ONG':
                return 'Organização';
            case 'USUARIO':
                return 'Usuário';
            default:
                return tipoUsuario || 'Usuário';
        }
    };

    return (
        <div className="home-container">
            
            <header className="header-bar">
                <h1>SocialHub</h1>
                <div className="user-info">
                    <span>Bem-vindo, {getUserDisplayName()}</span>
                    <span>•</span>
                    <span>{getUserTypeDisplay()}</span>
                </div>
            </header>

            <main className="main-content">

                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h3>Navegação</h3>
                        <div className="sidebar-buttons">
                            {(tipoUsuario === 'ADMIN' || tipoUsuario === 'ONG') && (
                                <button 
                                    className="primary" 
                                    onClick={irParaPostagem}
                                >
                                    Nova Publicação
                                </button>
                            )}
                            <button onClick={irParaPerfil}>
                                Meu Perfil
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Sistema</h3>
                        <div className="sidebar-buttons">
                            <button 
                                className="danger" 
                                onClick={logout}
                            >
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
                                <button onClick={() => window.location.reload()}>
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
                                    titulo={pub.titulo}
                                    conteudo={pub.conteudo}
                                    autor={pub.instituicaoNome || pub.autor || pub.usuario || 'Usuário'}
                                    data={formatDistanceToNow(
                                        new Date(pub.dataCriacao || pub.createdAt || pub.data), 
                                        { locale: ptBR, addSuffix: true }
                                    )}
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
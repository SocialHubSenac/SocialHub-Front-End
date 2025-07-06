import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Perfil.css';

function Perfil() {
    const { token } = useContext(AuthContext);
    const [usuario, setUsuario] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPostagens, setLoadingPostagens] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function buscarDadosUsuario() {
            try {
                const response = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuario(response.data);
            } catch (error) {
                console.error('Erro ao buscar perfil do usuário:', error);
                setError('Não foi possível carregar as informações do perfil');
            } finally {
                setLoading(false);
            }
        }

        async function buscarPostagensUsuario() {
            try {
                const response = await api.get('/postagens/usuario', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPostagens(response.data);
            } catch (error) {
                console.error('Erro ao buscar postagens do usuário:', error);
                try {
                    const allPostsResponse = await api.get('/postagens', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const userPosts = allPostsResponse.data.filter(post => 
                        post.autor_id === usuario?.id || post.usuario_id === usuario?.id
                    );
                    setPostagens(userPosts);
                } catch (fallbackError) {
                    console.error('Erro ao buscar postagens:', fallbackError);
                    setPostagens([]);
                }
            } finally {
                setLoadingPostagens(false);
            }
        }

        buscarDadosUsuario();
        
        if (usuario) {
            buscarPostagensUsuario();
        }
    }, [token, usuario?.id]);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="perfil-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="perfil-container">
                <div className="error">
                    <h2>Erro ao carregar perfil</h2>
                    <p>{error || 'Não foi possível carregar as informações.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="perfil-container">

            <div className="perfil-header">
                <div className="avatar">
                    <div className="avatar-circle">
                        {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
                <div className="usuario-info">
                    <h1>{usuario.nome}</h1>
                    <p className="email">{usuario.email}</p>
                    <span className="tipo-usuario">{usuario.tipo}</span>
                </div>
            </div>

            <div className="perfil-stats">
                <div className="stat-item">
                    <span className="stat-number">{postagens.length}</span>
                    <span className="stat-label">Postagens</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">
                        {new Date(usuario.created_at || usuario.data_criacao || Date.now()).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                    </span>
                    <span className="stat-label">Membro desde</span>
                </div>
            </div>

            <div className="perfil-postagens">
                <h2>Suas Postagens</h2>
                
                {loadingPostagens ? (
                    <div className="loading-postagens">
                        <div className="spinner"></div>
                        <p>Carregando postagens...</p>
                    </div>
                ) : postagens.length === 0 ? (
                    <div className="sem-postagens">
                        <p>Você ainda não fez nenhuma postagem.</p>
                        <p>Que tal criar sua primeira postagem?</p>
                    </div>
                ) : (
                    <div className="postagens-lista">
                        {postagens.map((postagem) => (
                            <div key={postagem.id} className="postagem-item">
                                <div className="postagem-header">
                                    <div className="postagem-autor">
                                        <div className="autor-avatar">
                                            {usuario.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="autor-info">
                                            <span className="autor-nome">{usuario.nome}</span>
                                            <span className="postagem-data">
                                                {formatarData(postagem.created_at || postagem.data_criacao)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="postagem-conteudo">
                                    <p>{postagem.conteudo || postagem.texto}</p>
                                </div>
                                <div className="postagem-actions">
                                    <button className="action-btn">
                                        <span>❤️</span>
                                        <span>{postagem.likes || 0}</span>
                                    </button>
                                    <button className="action-btn">
                                        <span>💬</span>
                                        <span>{postagem.comentarios || 0}</span>
                                    </button>
                                    <button className="action-btn">
                                        <span>🔄</span>
                                        <span>{postagem.compartilhamentos || 0}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Perfil;
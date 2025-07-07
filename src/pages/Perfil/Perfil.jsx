import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Perfil.css';

function Perfil() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPostagens, setLoadingPostagens] = useState(true);
    const [error, setError] = useState(null);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            console.log('🔍 Iniciando carregamento de dados...');
            console.log('🔑 Token disponível:', !!token);
            
            if (!token) {
                console.log('❌ Token não encontrado, redirecionando para login');
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                console.log('📞 Fazendo chamada para /auth/me');
                console.log('🔑 Token sendo usado:', token.substring(0, 20) + '...');
                
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };

                const userResponse = await api.get('/auth/me', config);

                console.log('📋 Resposta da API:', userResponse);
                console.log('👤 Dados do usuário:', userResponse.data);

                if (userResponse.data) {
                    setUsuario(userResponse.data);
                    console.log('✅ Usuário definido:', userResponse.data);
                    
                    console.log('📝 Buscando postagens...');
                    setLoadingPostagens(true);
                    
                    try {
                        const postagensResponse = await api.get('/postagens/usuario', config);
                        console.log('📝 Postagens encontradas:', postagensResponse.data);
                        setPostagens(Array.isArray(postagensResponse.data) ? postagensResponse.data : []);
                    } catch (postagensError) {
                        console.warn('⚠️ Erro ao buscar postagens específicas:', postagensError);
                        
                        try {
                            const allPostsResponse = await api.get('/postagens', config);
                            
                            if (Array.isArray(allPostsResponse.data)) {
                                const userPosts = allPostsResponse.data.filter(post => 
                                    post.autor_id === userResponse.data.id || 
                                    post.usuario_id === userResponse.data.id ||
                                    post.user_id === userResponse.data.id
                                );
                                console.log('📝 Postagens filtradas:', userPosts);
                                setPostagens(userPosts);
                            } else {
                                console.log('📝 Nenhuma postagem encontrada');
                                setPostagens([]);
                            }
                        } catch (fallbackError) {
                            console.error('❌ Erro ao buscar postagens:', fallbackError);
                            setPostagens([]);
                        }
                    }
                } else {
                    console.log('❌ Resposta da API vazia');
                    setError('Dados do usuário não encontrados na resposta da API');
                }
            } catch (error) {
                console.error('❌ Erro ao carregar dados:', error);
                console.error('❌ Status da resposta:', error.response?.status);
                console.error('❌ Dados do erro:', error.response?.data);
                
                let mensagemErro = 'Não foi possível carregar as informações do perfil';
                
                if (error.response?.status === 401) {
                    mensagemErro = 'Sessão expirada. Você será redirecionado para o login.';
                    setTimeout(() => {
                        logout();
                        navigate('/login');
                    }, 2000);
                } else if (error.response?.status === 404) {
                    mensagemErro = 'Endpoint não encontrado. Verifique se a API está rodando.';
                } else if (error.response?.status === 500) {
                    mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
                } else if (error.response?.data?.message) {
                    mensagemErro = error.response.data.message;
                } else if (error.code === 'ECONNREFUSED') {
                    mensagemErro = 'Não foi possível conectar com o servidor. Verifique se a API está rodando.';
                }
                
                setError(mensagemErro);
            } finally {
                setLoading(false);
                setLoadingPostagens(false);
            }
        }

        carregarDados();
    }, [token, navigate, logout]);

    const handleResetPassword = async () => {
        try {
            setResetLoading(true);
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            await api.post('/auth/reset-password', {
                email: usuario.email
            }, config);
            
            setResetSuccess(true);
            setTimeout(() => {
                setResetSuccess(false);
                setShowResetPassword(false);
            }, 3000);
        } catch (error) {
            console.error('Erro ao solicitar reset de senha:', error);
            let mensagemErro = 'Erro ao solicitar reset de senha. Tente novamente.';
            
            if (error.response?.status === 401) {
                mensagemErro = 'Sessão expirada. Faça login novamente.';
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 2000);
            } else if (error.response?.data?.message) {
                mensagemErro = error.response.data.message;
            }
            
            alert(mensagemErro);
        } finally {
            setResetLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    const formatarData = (data) => {
        if (!data) return 'Data não disponível';
        
        try {
            const dataObj = new Date(data);
            if (isNaN(dataObj.getTime())) return 'Data inválida';
            
            return dataObj.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const formatarDataCompleta = (data) => {
        if (!data) return 'Data não disponível';
        
        try {
            const dataObj = new Date(data);
            if (isNaN(dataObj.getTime())) return 'Data inválida';
            
            return dataObj.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Erro ao formatar data completa:', error);
            return 'Data inválida';
        }
    };

    // Debug para verificar o estado atual
    console.log('🔍 Estado atual:', {
        loading,
        error,
        usuario,
        token: !!token,
        postagens: postagens.length,
        apiBaseURL: api.defaults.baseURL
    });

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

    if (error) {
        return (
            <div className="perfil-container">
                <div className="error">
                    <h2>Erro ao carregar perfil</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-btn" 
                        onClick={handleRetry}
                    >
                        Tentar novamente
                    </button>
                    <div className="debug-info">
                        <h4>Informações de Debug:</h4>
                        <p>Token presente: {token ? 'Sim' : 'Não'}</p>
                        <p>URL atual: {window.location.href}</p>
                        <p>API Base: {api.defaults.baseURL || 'Não definida'}</p>
                        <p>Último erro: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="perfil-container">
                <div className="error">
                    <h2>Usuário não encontrado</h2>
                    <p>Os dados do usuário não foram carregados corretamente.</p>
                    <button 
                        className="retry-btn" 
                        onClick={handleRetry}
                    >
                        Tentar novamente
                    </button>
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
                    <h1>{usuario.nome || 'Usuário'}</h1>
                    <p className="email">{usuario.email}</p>
                    <span className="tipo-usuario">{usuario.tipo || 'Usuário'}</span>
                </div>
            </div>


            <div className="perfil-stats">
                <div className="stat-item">
                    <span className="stat-number">{postagens.length}</span>
                    <span className="stat-label">Postagens</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">
                        {formatarData(usuario.created_at || usuario.data_criacao || usuario.createdAt)}
                    </span>
                    <span className="stat-label">Membro desde</span>
                </div>
                <div className="stat-item">
                    <button 
                        className="reset-password-btn"
                        onClick={() => setShowResetPassword(true)}
                    >
                        🔒 Alterar Senha
                    </button>
                </div>
            </div>

            {/* Modal para Reset de Senha */}
            {showResetPassword && (
                <div className="modal-overlay" onClick={() => setShowResetPassword(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Alterar Senha</h3>
                        {resetSuccess ? (
                            <div className="success-message">
                                <p>✅ Solicitação enviada com sucesso!</p>
                                <p>Verifique seu email para redefinir sua senha.</p>
                            </div>
                        ) : (
                            <div>
                                <p>Deseja solicitar um link para alterar sua senha?</p>
                                <p className="email-info">Enviaremos um link para: <strong>{usuario.email}</strong></p>
                                <div className="modal-actions">
                                    <button 
                                        className="btn-cancel"
                                        onClick={() => setShowResetPassword(false)}
                                        disabled={resetLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="btn-confirm"
                                        onClick={handleResetPassword}
                                        disabled={resetLoading}
                                    >
                                        {resetLoading ? 'Enviando...' : 'Enviar Link'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Postagens do Usuário */}
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
                                            {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="autor-info">
                                            <span className="autor-nome">{usuario.nome}</span>
                                            <span className="postagem-data">
                                                {formatarDataCompleta(postagem.created_at || postagem.data_criacao || postagem.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="postagem-conteudo">
                                    <p>{postagem.conteudo || postagem.texto || postagem.content}</p>
                                </div>
                                <div className="postagem-actions">
                                    <button className="action-btn">
                                        <span>❤️</span>
                                        <span>{postagem.likes || 0}</span>
                                    </button>
                                    <button className="action-btn">
                                        <span>💬</span>
                                        <span>{postagem.comentarios || postagem.comments || 0}</span>
                                    </button>
                                    <button className="action-btn">
                                        <span>🔄</span>
                                        <span>{postagem.compartilhamentos || postagem.shares || 0}</span>
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
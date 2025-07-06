import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import './Home.css';
import WelcomeMessage from "../../components/WelcomeMessage";
import PrimaryButton from "../../components/PrimaryButton";

function LoadingSpinner() {
    return <div className="spinner">Carregando...</div>;
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
    const { logout, tipoUsuario } = useContext(AuthContext);
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

    return (
        <div className="home-container">
            <h1>Bem-vindo ao SocialHub</h1>
            <p>Você está autenticado.</p>
            
            <div className="home-buttons">
                {(tipoUsuario === 'ADMIN' || tipoUsuario === 'ONG') && (
                    <button onClick={irParaPostagem}>Nova Publicação</button>
                )}
                <button onClick={irParaPerfil}>Meu Perfil</button>
                <button onClick={logout}>Sair</button>
            </div>

            <section className="feed-container">
                <h2>Feed de Publicações</h2>
                
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
                    <p>Nenhuma publicação encontrada.</p>
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
            </section>
        </div>
    );
}

export default Home;
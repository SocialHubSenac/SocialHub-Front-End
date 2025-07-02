import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import './Home.css';

function Home() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [postagens, setPostagens] = useState([]);
    const [loading, setLoading] = useState(true);

    const irParaPostagem = () => {
        navigate("/postar");
    };

    const irParaPerfil = () => {
        navigate("/perfil");
    };

useEffect(() => {
    async function fetchPostagens() {
        try {
        const response = await api.get('/postagens');
        setPostagens(response.data);
        } catch (error) {
        console.error("Erro ao buscar postagens:", error);
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
            <button onClick={irParaPostagem}>Nova Publicação</button>
            <button onClick={irParaPerfil}>Meu Perfil</button>
            <button onClick={logout}>Sair</button>
        </div>

    <section className="feed-container">
        <h2>Feed de Publicações</h2>
        {loading ? (
        <p>Carregando publicações...</p>
        ) : (
        postagens.length === 0 ? (
            <p>Nenhuma publicação encontrada.</p>
        ) : (
            postagens.map((pub) => (
            <article key={pub.id} className="post-item">
                <p><strong>{pub.titulo}</strong></p>
                <p>{pub.conteudo}</p>
                <small>
                    Publicado por: {pub.instituicaoNome} • {formatDistanceToNow(new Date(pub.dataCriacao), { locale: ptBR, addSuffix: true })}
                </small>
            </article>
            ))
        )
        )}
        </section>
    </div>
    );
}

export default Home;

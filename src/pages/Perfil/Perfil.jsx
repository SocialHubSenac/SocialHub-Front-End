import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Perfil.css';

function Perfil() {
    const { token } = useContext(AuthContext);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

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
        } finally {
        setLoading(false);
    }
}

    buscarDadosUsuario();
}, [token]);

    if (loading) return <p>Carregando perfil...</p>;

    if (!usuario) return <p>Não foi possível carregar as informações.</p>;

return (
        <div className="perfil-container">
            <h1>Meu Perfil</h1>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Tipo:</strong> {usuario.tipo}</p>
            </div>
    );
}

export default Perfil;

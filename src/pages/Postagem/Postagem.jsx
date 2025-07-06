import { useState } from 'react';
import api from '../services/api';
import './Postagem.css';

function Postagem() {
const [titulo, setTitulo] = useState('');
const [conteudo, setConteudo] = useState('');
const [mensagem, setMensagem] = useState('');
const [tipoMensagem, setTipoMensagem] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
    const dadosPostagem = {
        titulo: titulo || 'Publicação',
        conteudo: conteudo,
    };

    const response = await api.post('/postagens', dadosPostagem);
    console.log('Postagem criada:', response.data);

    setMensagem('Postagem criada com sucesso!');
    setTipoMensagem('sucesso');
    setTitulo('');
    setConteudo('');
    } catch (error) {
    console.error('Erro ao criar postagem:', error.response || error.message);
    if (error.response) {
        setMensagem(`Erro: ${error.response.data.message || 'Erro no servidor'}`);
    } else if (error.request) {
        setMensagem('Erro de conexão. Verifique sua internet.');
    } else {
        setMensagem('Erro inesperado. Tente novamente.');
    }
    setTipoMensagem('erro');
    } finally {
    setLoading(false);
    }
};

return (
    <div className='postagem-container'>
    <h2>Nova Publicação</h2>
    <form onSubmit={handleSubmit} className='postagem-form'>
        <input
        type="text"
        placeholder='Título da publicação (opcional)'
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={100}
        className="postagem-titulo"
        />

        <textarea
        placeholder='Escreva algo para compartilhar com a comunidade...'
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        required
        maxLength={1000}
        />

        <div className="contador-caracteres">
        <span className={conteudo.length > 900 ? 'limite' : ''}>
            {conteudo.length}/1000 caracteres
        </span>
        </div>

        <button type='submit' disabled={loading || !conteudo.trim()}>
        {loading ? 'Publicando...' : 'Publicar'}
        </button>

        {mensagem && (
        <div className={`mensagem ${tipoMensagem}`}>
            {mensagem}
        </div>
        )}
    </form>
    </div>
);
}

export default Postagem;

import { useState } from 'react';
import api from '../services/api';
import './Postagem.css';

function Postagem() {
    const [conteudo, setConteudo] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await api.post('/postagens', { conteudo });
            setMensagem('Postagem criada com sucesso!');
            setConteudo('');
        } catch (error) {
            console.error('Erro ao criar postagem:', error);
            setMensagem('Erro ao criar postagem. Tente novamente.');
        }
    };

    return (
        <div className='postagem-container'>
            <h2>Nova Publicação</h2>
            <form onSubmit={handleSubmit} className='postagem-form'>
                <textarea
                placeholder='Escreva algo para compartilhar com a comunidade.'
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
                />
                <button type='submit'>Publicar</button>
                {mensagem && <p className='mensagem'>{mensagem}</p>}
            </form>
        </div>
    );
}

export default Postagem;
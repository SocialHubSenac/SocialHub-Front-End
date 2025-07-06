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
        
        if (!conteudo.trim()) {
            setMensagem('Por favor, escreva algo para publicar.');
            setTipoMensagem('erro');
            return;
        }

        setLoading(true);
        setMensagem('');

        try {
            const dadosPostagem = {
                titulo: titulo.trim() || 'Publicação',
                conteudo: conteudo.trim(),
            };

            console.log('Enviando dados:', dadosPostagem);

            const response = await api.post('/postagens', dadosPostagem);
            console.log('Postagem criada:', response.data);

            setMensagem('Postagem criada com sucesso!');
            setTipoMensagem('sucesso');
            setTitulo('');
            setConteudo('');
            
            setTimeout(() => {
                setMensagem('');
                setTipoMensagem('');
            }, 3000);

        } catch (error) {
            console.error('Erro ao criar postagem:', error);
            
            let mensagemErro = 'Erro inesperado. Tente novamente.';
            
            if (error.response) {
                mensagemErro = error.response.data?.message || 
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
        <div className="postagem-container">
            <h2>Nova Publicação</h2>
            
            <form onSubmit={handleSubmit} className="postagem-form">
                <input
                    type="text"
                    placeholder="Título da publicação (opcional)"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    maxLength={100}
                    className="postagem-titulo"
                    disabled={loading}
                />

                <textarea
                    placeholder="Escreva algo para compartilhar com a comunidade..."
                    value={conteudo}
                    onChange={handleConteudoChange}
                    required
                    maxLength={1000}
                    disabled={loading}
                    rows={6}
                />

                <div className="contador-caracteres">
                    <span className={conteudo.length > 900 ? 'limite' : ''}>
                        {conteudo.length}/1000 caracteres
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Publicando...
                        </>
                    ) : (
                        'Publicar'
                    )}
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
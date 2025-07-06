import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import './Cadastro.css';

function Cadastro() {
const { register } = useContext(AuthContext);

const [tipo, setTipo] = useState('USER');
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [confirmarSenha, setConfirmarSenha] = useState('');
const [cnpj, setCnpj] = useState('');
const [descricao, setDescricao] = useState('');
const [error, setError] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
    setError('As senhas não coincidem');
    return;
    }

    const dadosCadastro = {
    nome,
    email,
    senha,
    tipo,
    ...(tipo === 'ONG' && { cnpj, descricao }),
    };

    try {
    await register(dadosCadastro);
    setError('');
    alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
        
    } catch (err) {
    setError(err.message || 'Erro no cadastro');
    }
};

return (
    <div className="cadastro-container">
    <h1>Crie sua conta no SocialHub</h1>
    <form onSubmit={handleSubmit} className="cadastro-form">
        {error && <p className="error-message">{error}</p>}

        <label>Tipo de Conta:</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)} required>
        <option value="USER">Usuário</option>
        <option value="ONG">ONG</option>
        </select>

        <label>Nome:</label>
        <input
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
        />

        <label>E-mail:</label>
        <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        />

        <label>Senha:</label>
        <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
        />

        <label>Confirme sua senha:</label>
        <input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChange={e => setConfirmarSenha(e.target.value)}
        required
        />

        {tipo === 'ONG' && (
        <>
            <label>CNPJ:</label>
            <input
            type="text"
            placeholder="CNPJ"
            value={cnpj}
            onChange={e => setCnpj(e.target.value)}
            required={tipo === 'ONG'}
            />

            <label>Descrição da ONG:</label>
            <textarea
            placeholder="Descrição da ONG"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required={tipo === 'ONG'}
            rows={3}
            />
        </>
        )}

        <PrimaryButton type="submit" text="Cadastrar" />
        </form>

        <div className="login-link">
        <p>Já tem uma conta?</p>
        <a href="/login" className="login-button">
            Fazer login
        </a>
        </div>
    </div>
    );
}

export default Cadastro;

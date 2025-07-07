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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação das senhas
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    // Validações adicionais
    if (nome.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    // Validação específica para ONG
    if (tipo === 'ONG') {
      if (!cnpj || cnpj.trim().length < 14) {
        setError('CNPJ deve ter pelo menos 14 caracteres');
        setLoading(false);
        return;
      }
      if (!descricao || descricao.trim().length < 10) {
        setError('Descrição deve ter pelo menos 10 caracteres');
        setLoading(false);
        return;
      }
    }

    const dadosCadastro = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
      tipo,
      ...(tipo === 'ONG' && { 
        cnpj: cnpj.trim(), 
        descricao: descricao.trim() 
      }),
    };

    try {
      await register(dadosCadastro);
      
      // Limpar o formulário após sucesso
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setCnpj('');
      setDescricao('');
      setTipo('USER');
      
    } catch (err) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Crie sua conta no SocialHub</h1>
      <form onSubmit={handleSubmit} className="cadastro-form">
        {error && <p className="error-message">{error}</p>}

        <label>Tipo de Conta:</label>
        <select 
          value={tipo} 
          onChange={e => setTipo(e.target.value)} 
          required
          disabled={loading}
        >
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
          minLength={2}
          disabled={loading}
        />

        <label>E-mail:</label>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label>Senha:</label>
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />

        <label>Confirme sua senha:</label>
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />

        {tipo === 'ONG' && (
          <>
            <label>CNPJ:</label>
            <input
              type="text"
              placeholder="CNPJ (apenas números)"
              value={cnpj}
              onChange={e => setCnpj(e.target.value.replace(/\D/g, ''))}
              required={tipo === 'ONG'}
              maxLength={14}
              disabled={loading}
            />

            <label>Descrição da ONG:</label>
            <textarea
              placeholder="Descrição da ONG (mínimo 10 caracteres)"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required={tipo === 'ONG'}
              rows={3}
              minLength={10}
              disabled={loading}
            />
          </>
        )}

        <PrimaryButton 
          type="submit" 
          text={loading ? "Cadastrando..." : "Cadastrar"}
          disabled={loading}
        />
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
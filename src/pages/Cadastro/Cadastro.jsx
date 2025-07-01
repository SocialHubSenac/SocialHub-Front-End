import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Cadastro() {
    const { register } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
        setError('As senhas não coincidem');
        return;
    }

    try {
        await register({ email, senha });
    } catch (err) {
        console.error(err);
        setError("Erro ao cadastrar. Tente novamente.");
    }
};

return (
    <div className="cadastro-container">
        <h1>Crie sua conta no SocialHub</h1>
        <form onSubmit={handleSubmit} className="cadastro-form">
    {error && <p className="error-message">{error}</p>}

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />

        <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        />

        <input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        required
        />

        <button type="submit">Cadastrar</button>
    </form>
    </div>
    );
}

export default Cadastro;

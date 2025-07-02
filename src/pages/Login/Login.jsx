import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import './Login.css';

function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, senha });
    };

    return (
        <div className="login-container">
            <h1>Login no SocialHub</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        required
                        onChange={(e) => setSenha(e.target.value)} 
                    />
                </div>
                <PrimaryButton type="submit" text="Entrar"/>
            </form>
        </div>
    )
}

export default Login;

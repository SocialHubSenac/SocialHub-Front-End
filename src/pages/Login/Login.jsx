import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';
import './Login.css';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetData, setResetData] = useState({
        email: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');
        
        try {
            await login({ email, senha });
            navigate('/home');
        } catch (error) {
            console.error('Erro no login:', error);
            setErro('Email ou senha incorretos');
        } finally {
            setLoading(false);
        }
    };

    // Função para redefinir senha
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');
        
        if (!resetData.email || !resetData.email.trim()) {
            setErro('Email é obrigatório');
            setLoading(false);
            return;
        }

        if (resetData.novaSenha !== resetData.confirmarSenha) {
            setErro('As senhas não coincidem');
            setLoading(false);
            return;
        }

        if (resetData.novaSenha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: resetData.email.toLowerCase().trim(),
                    novaSenha: resetData.novaSenha
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao redefinir senha');
            }

            alert('Senha redefinida com sucesso! Agora você pode fazer login com a nova senha.');
            closeResetModal();
            
            setEmail(resetData.email);
            
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            
            if (error.message.includes('Failed to fetch')) {
                setErro('Erro de conexão com o servidor. Verifique sua conexão.');
            } else {
                setErro(error.message || 'Erro ao redefinir senha. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        setResetData({
            email: '',
            novaSenha: '',
            confirmarSenha: ''
        });
        setErro('');
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="logo-container">
                    <svg viewBox="0 0 320 110" xmlns="http://www.w3.org/2000/svg" className="login-logo">
                        <defs>
                            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:"#6b5fff", stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:"#5a54e6", stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        
                        <g transform="translate(15, 25)">
                            <circle cx="30" cy="30" r="12" fill="url(#primaryGradient)" stroke="#FFFFFF" strokeWidth="2"/>
                            
                            <circle cx="10" cy="15" r="6" fill="#5a54e6" opacity="0.8"/>
                            <circle cx="50" cy="15" r="6" fill="#5a54e6" opacity="0.8"/>
                            <circle cx="10" cy="45" r="6" fill="#5a54e6" opacity="0.8"/>
                            <circle cx="50" cy="45" r="6" fill="#5a54e6" opacity="0.8"/>
                            <circle cx="30" cy="5" r="5" fill="#7c73ff" opacity="0.7"/>
                            <circle cx="30" cy="55" r="5" fill="#7c73ff" opacity="0.7"/>
                            
                            <line x1="18" y1="21" x2="24" y2="24" stroke="#5a54e6" strokeWidth="2" opacity="0.6"/>
                            <line x1="42" y1="21" x2="36" y2="24" stroke="#5a54e6" strokeWidth="2" opacity="0.6"/>
                            <line x1="18" y1="39" x2="24" y2="36" stroke="#5a54e6" strokeWidth="2" opacity="0.6"/>
                            <line x1="42" y1="39" x2="36" y2="36" stroke="#5a54e6" strokeWidth="2" opacity="0.6"/>
                            <line x1="30" y1="10" x2="30" y2="18" stroke="#7c73ff" strokeWidth="2" opacity="0.6"/>
                            <line x1="30" y1="50" x2="30" y2="42" stroke="#7c73ff" strokeWidth="2" opacity="0.6"/>
                            
                            <circle cx="30" cy="30" r="18" fill="none" stroke="#5a54e6" strokeWidth="1" opacity="0.3"/>
                            <circle cx="30" cy="30" r="22" fill="none" stroke="#7c73ff" strokeWidth="1" opacity="0.2"/>
                        </g>
                        
                        <g transform="translate(95, 35)">
                            <text x="0" y="25" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="600" fill="#222222">
                                Social
                            </text>
                            
                            <text x="82" y="25" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="700" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="3">
                                Hub
                            </text>
                            <text x="82" y="25" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="700" fill="url(#primaryGradient)">
                                Hub
                            </text>
                            
                            <text x="0" y="45" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="400" fill="#555555" opacity="0.9">
                                Conectando Inovação Social
                            </text>
                        </g>
                    </svg>
                </div>

                <div className="login-form-container">
                    <h1>Login no SocialHub</h1>
                    
                    {erro && <div className="login-error">{erro}</div>}
                    
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
                        <PrimaryButton 
                            type="submit" 
                            text={loading ? "Entrando..." : "Entrar"}
                            disabled={loading}
                        />
                    </form>
                    
                    <div className="forgot-password">
                        <button 
                            type="button"
                            className="forgot-password-link"
                            onClick={() => setShowResetModal(true)}
                        >
                            Esqueceu sua senha?
                        </button>
                    </div>

                    <div className="signup-link">
                        <p>Ainda não tem uma conta?</p>
                        <Link to="/cadastro" className="signup-button">
                            Criar conta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal Simplificado de Redefinição de Senha */}
            {showResetModal && (
                <div className="reset-modal-overlay">
                    <div className="reset-modal">
                        <button 
                            className="reset-modal-close"
                            onClick={closeResetModal}
                        >
                            ×
                        </button>

                        <h2>Redefinir Senha</h2>

                        {erro && <div className="reset-error">{erro}</div>}

                        <form onSubmit={handleResetPassword} className="reset-form">
                            <p>Digite seu email e a nova senha:</p>
                            
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={resetData.email}
                                    required
                                    placeholder="Digite seu email"
                                    onChange={(e) => setResetData(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                />
                            </div>
                            
                            <div>
                                <label>Nova Senha:</label>
                                <input
                                    type="password"
                                    value={resetData.novaSenha}
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    onChange={(e) => setResetData(prev => ({
                                        ...prev,
                                        novaSenha: e.target.value
                                    }))}
                                />
                            </div>
                            
                            <div>
                                <label>Confirmar Nova Senha:</label>
                                <input
                                    type="password"
                                    value={resetData.confirmarSenha}
                                    required
                                    minLength={6}
                                    placeholder="Digite novamente"
                                    onChange={(e) => setResetData(prev => ({
                                        ...prev,
                                        confirmarSenha: e.target.value
                                    }))}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="reset-button"
                                disabled={loading}
                            >
                                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;
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
        <div className="login-wrapper">
            <div className="login-container">
                {/* Logo SVG inline */}
                <div className="logo-container">
                    <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" className="login-logo">
                        <defs>
                            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:"#6b5fff", stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:"#5a54e6", stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        
                        <g transform="translate(10, 20)">
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
                        
                        <g transform="translate(85, 30)">
                            <text x="0" y="25" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="600" fill="#222222">
                                Social
                            </text>
                            <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" fill="url(#primaryGradient)">
                                Hub
                            </text>
                            <text x="0" y="45" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="400" fill="#555555" opacity="0.9">
                                Conectando Inovação Social
                            </text>
                        </g>
                    </svg>
                </div>

                <div className="login-form-container">
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
            </div>
        </div>
    )
}

export default Login;
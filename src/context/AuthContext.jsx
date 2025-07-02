import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async ({ email, senha }) => {
        try {
            const response = await api.post('/auth/login', { email, senha });
            const tokenRecebido = response.data;

            setToken(tokenRecebido);
            localStorage.setItem('token', tokenRecebido);

            navigate('/');
        } catch (error) {
            alert('Login inválido');
            console.error('Erro ao fazer login:', error);
        }
    };

    const register = async ({ nome, email, senha, tipo, cnpj, descricao }) => {
        try {
            const payload = {
                nome,
                email,
                senha,
                tipo,
                ...(tipo === "ONG" && { cnpj, descricao }),
            };

            await api.post('/auth/register', payload);
            await login({ email, senha });

        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            throw new Error(
                error.response?.data?.mensagem || 'Erro no cadastro'
            );
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{ token, login, logout, register, autenticado: !!token }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

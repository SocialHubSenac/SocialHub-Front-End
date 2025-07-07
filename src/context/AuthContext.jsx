import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  // Decodifica o JWT para extrair dados
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return {};
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = parseJwt(token);
        if (decoded.sub) { // 'sub' é o campo padrão do JWT para o subject (email)
          setUsuario({
            id: decoded.id,
            instituicaoId: decoded.instituicaoId || null,
            nome: decoded.nome || decoded.name,
            email: decoded.sub,
          });
          setTipoUsuario(decoded.role || decoded.tipo || 'USUARIO');
        } else {
          logout();
        }
      } catch {
        logout();
      }
    } else {
      setUsuario(null);
      setTipoUsuario(null);
    }
    setLoading(false);
  }, [token]);

  const login = async ({ email, senha }) => {
    try {
      // Limpar dados de entrada
      const emailLimpo = email.trim();
      const senhaLimpa = senha.trim();
      
      console.log('🔍 Tentando login com:', { email: emailLimpo });
      
      const response = await api.post('/auth/login', { 
        email: emailLimpo, 
        senha: senhaLimpa 
      });
      
      console.log('📥 Resposta da API:', response.data);

      // O backend retorna { token: "...", message: "..." }
      const tokenRecebido = response.data.token;

      if (!tokenRecebido) {
        throw new Error('Token não recebido do servidor');
      }

      // Salvar token
      setToken(tokenRecebido);
      localStorage.setItem('token', tokenRecebido);

      // Decodificar token para obter dados do usuário
      const decoded = parseJwt(tokenRecebido);
      console.log('🔓 Token decodificado:', decoded);
      
      setUsuario({
        id: decoded.id,
        instituicaoId: decoded.instituicaoId || null,
        nome: decoded.nome || decoded.name,
        email: decoded.sub,
      });
      setTipoUsuario(decoded.role || decoded.tipo || 'USUARIO');

      console.log('✅ Login realizado com sucesso');
      
      // Navegação corrigida para /home
      navigate('/home');
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Tratar erros específicos baseados na resposta do backend
      if (error.response?.status === 401) {
        // Backend retorna { message: "Email ou senha incorretos" }
        throw new Error(error.response.data?.message || 'Email ou senha incorretos');
      } else if (error.response?.status === 400) {
        // Erros de validação
        const errors = error.response.data;
        if (typeof errors === 'object' && errors.message) {
          throw new Error(errors.message);
        } else {
          throw new Error('Dados inválidos');
        }
      } else if (error.response?.status >= 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.response?.data?.message || 'Falha no login');
      }
    }
  };

  const register = async ({ nome, email, senha, tipo, cnpj, descricao }) => {
    try {
      if (!nome || !email || !senha || !tipo) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      if (tipo === 'ONG' && (!cnpj || !descricao)) {
        throw new Error('CNPJ e descrição são obrigatórios para ONGs.');
      }

      const payload = {
        nome,
        email,
        senha,
        tipo, // ✅ CORREÇÃO: usar 'tipo' ao invés de 'role'
        ...(tipo === 'ONG' && { cnpj, descricao }),
      };

      console.log('📤 Enviando dados de registro:', payload);

      const response = await api.post('/auth/register', payload);
      console.log('📥 Resposta do registro:', response.data);

      // Após registrar, fazer login automaticamente
      await login({ email, senha });
      
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      
      // Melhor tratamento de erros - extrair mensagem específica
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        // Verificar diferentes formatos de erro que o backend pode retornar
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else if (errorData.error) {
          throw new Error(errorData.error);
        } else if (errorData.errors) {
          // Para erros de validação que vêm como array
          if (Array.isArray(errorData.errors)) {
            throw new Error(errorData.errors.join(', '));
          } else if (typeof errorData.errors === 'object') {
            // Para erros de validação que vêm como objeto
            const errorMessages = Object.values(errorData.errors).flat();
            throw new Error(errorMessages.join(', '));
          }
        } else {
          throw new Error('Dados inválidos para cadastro');
        }
      } else if (error.response?.status === 409) {
        // Conflito - usuário já existe
        throw new Error('Este email já está cadastrado');
      } else if (error.response?.status >= 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao registrar usuário.');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setTipoUsuario(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        register,
        autenticado: !!token,
        usuario,
        tipoUsuario,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
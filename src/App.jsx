import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Perfil from './pages/Perfil/Perfil';
import Postagem from './pages/Postagem/Postagem';
import RotaPrivada from './routes/RotaPrivada';
import WelcomeMessage from './components/WelcomeMessage';
import PrimaryButton from './components/PrimaryButton';

import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext'; // Importa o PostProvider

function App() {
  return (
    <AuthProvider>
      <PostProvider> {/* Envolve toda a aplicação com o contexto de postagens */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/home/welcome-message" element={<WelcomeMessage />} />
          <Route path="/primary-button" element={<PrimaryButton />} />


          <Route
            path="/nova-postagem"
            element={
              <RotaPrivada>
                <Postagem />
              </RotaPrivada>
            }
          />

          <Route
            path="/"
            element={
              <RotaPrivada>
                <Home />
              </RotaPrivada>
            }
          />
          <Route
            path="/home"
            element={
              <RotaPrivada>
                <Home />
              </RotaPrivada>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaPrivada>
                <Perfil />
              </RotaPrivada>
            }
          />
        </Routes>
      </PostProvider> {/* Fecha o PostProvider */}
    </AuthProvider>
  );
}

export default App;
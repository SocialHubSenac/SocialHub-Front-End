import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Perfil from './pages/Perfil/Perfil';
import RotaPrivada from './routes/RotaPrivada';
import WelcomeMessage from './components/WelcomeMessage';
import PrimaryButton from './components/PrimaryButton';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/welcome-message" element={<WelcomeMessage />/*rota criada apenas para visualizacao da mensagem*/} />
      <Route path="/primary-button" element={<PrimaryButton />/*rota criada apenas para visualizacao do botão*/} />
      
      <Route
        path="/"
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
  );
}

export default App;
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import RotaPrivada from './routes/RotaPrivada';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/"
        element={
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        }
      />
    </Routes>
  );
}

export default App;

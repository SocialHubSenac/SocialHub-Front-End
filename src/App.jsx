import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Login/Loginome'; // opcional: pode ser só um "Olá"
import Login from './pages/Login'; // ainda vamos criar essa página
import RotaPrivada from './routes/RotaPrivada'; // a gente cria esse depois

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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

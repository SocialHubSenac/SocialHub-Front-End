import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import '../style/Home.css';

function Home() {
    const { logout } = useContext(AuthContext);

    return(
        <div className="home-container">
            <h1>Bem-vindo ao SocialHub</h1>
            <p>Você está autenticado.</p>
            <button onClick={logout}>
                Sair
            </button>
        </div>
    )
}

export default Home;

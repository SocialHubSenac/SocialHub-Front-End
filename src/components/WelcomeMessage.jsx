import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './WelcomeMessage.css'

const WelcomeMessage = () =>{
    const { user } = useContext(AuthContext); 

    return(
        <div className="welcome-message">
            <h2>
            Olá, {user?.nome || 'Pedro'}! Bem-vindo de volta ao <strong>SocialHub</strong>. 
            </h2>
        </div>
    );
};

export default WelcomeMessage;
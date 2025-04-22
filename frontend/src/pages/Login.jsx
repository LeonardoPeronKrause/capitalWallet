import React, { useState } from 'react';
import api from '../services/api';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const resposta = await api.post('/login', {
                email,
                senha
            });

           console.log('Logged in!', resposta.data);

            localStorage.setItem('token', resposta.data.token);
        } catch (erro) {
            console.error('Login error: ' + erro.response?.data || erro.message);
        }
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleLogin}>
                <h1 className='login-title'>Capital Wallet</h1>
                <p className='login-subtitle'>Controle seu patrimônio com confiança.</p>
            
                <label>Email:</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

            
                <label>Senha:</label>
                <input
                    type='password'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <button type='submit'>Entrar</button>
            </form>
        </div>
    );
}

export default Login;
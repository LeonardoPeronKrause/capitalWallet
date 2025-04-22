import { useState } from 'react';
import api from '../services/api';

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
        <div style={{ padding: '5rem' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email: </label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Senha: </label>
                    <input
                        type='password'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <button type='submit'>Entrar</button>
            </form>
        </div>
    );
}

export default Login;
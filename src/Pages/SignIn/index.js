import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/auth';
import logo from '../../Assets/logo.png'
import './SignIn.css';

export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { LogIn, loadingAuth } = useContext(AuthContext);

    function HandleSubmit(e){
        e.preventDefault();
        
        if (email !== '' && password !== ''){
            LogIn(email, password);
        }
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="logo-area">
                    <img src={logo} alt="Logo do sistema" />
                </div>
                <form onSubmit={HandleSubmit}>
                    <h1>Entrar</h1>
                    <input type="text" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="******" value={password} onChange={ (e) => setPassword(e.target.value)}/>
                    <button type="submit">{loadingAuth ? 'Carregando...' : 'Login'}</button>
                </form>
                <Link to="/register" >Criar uma conta</Link>
            </div>
        </div>
    )
}
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/auth';
import logo from '../../Assets/logo.png'

export default function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { UserRegister, loadingAuth } = useContext(AuthContext);

    function HandleSubmit(e){
        e.preventDefault();
        
        if (name !== '' && email !== '' && password !=='') {
            UserRegister(email, password, name);
        }
        
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="logo-area">
                    <img src={logo} alt="Logo do sistema" />
                </div>
                <form onSubmit={HandleSubmit}>
                    <h1>Cadastrar</h1>
                    <input type="text" placeholder="nome" value={name} onChange={ (e) => setName(e.target.value)} />
                    <input type="email" placeholder="email@email.com" value={email} onChange={ (e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="******" value={password} onChange={ (e) => setPassword(e.target.value)}/>
                    <button type="submit">{loadingAuth ? 'Cadastrando' : 'Sign Up'}</button>
                </form>
                <Link to="/" >Já tem uma conta? Entre aqui.</Link>
            </div>
        </div>
    )
}
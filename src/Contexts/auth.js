import { useState, useEffect, createContext } from 'react';
import { toast } from 'react-toastify';
import firebase from '../Services/firebaseConnection';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
    
        function LoadStorage() {
            const storageUser = localStorage.getItem('SystemUser');

            if (storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        LoadStorage();

    }, [])

    async function LogIn(email, password){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (value) => {
            let uid = value.user.uid;
            
            const userProfile = await firebase.firestore().collection('users').doc(uid)
            .get();

            let data = {
                uid: uid,
                username: userProfile.data().username,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo de volta!')

        })
        .catch((error) => {
            console.log(error)
            setLoadingAuth(true);
            toast.error('Ops!!! Algo deu errado!')
        })
    }

    async function UserRegister(email, password, name){
        console.log('função acessada')
        setLoadingAuth(true);
        
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            console.log('cadastro feito')
            
            await firebase.firestore().collection('users').doc(uid)
            .set({
                username: name,
                avatarUrl: null
            })
            .then(() => {
                let data = {
                    uid: uid,
                    username: name,
                    avatarUrl: null
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                console.log('Doc Registrado')
            })       
        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops!!! Algo deu errado!');
            setLoadingAuth(false);     
        })
    }

    function storageUser(data) {
        localStorage.setItem('SystemUser', JSON.stringify(data));
    }

    async function SignOut(){
        await firebase.auth.SignOut;

        localStorage.removeItem('SystemUser');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, 
        user, 
        loading, 
        UserRegister,
        SignOut,
        LogIn, 
        loadingAuth, 
        setUser,
        storageUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
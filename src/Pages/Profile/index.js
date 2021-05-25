import { useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/auth';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import avatar from '../../Assets/avatar.png';
import firebase from '../../Services/firebaseConnection';
import { FiSettings, FiUpload } from 'react-icons/fi';
import './Profile.css';


export default function Profile(){
    const { user, SignOut, setUser, storageUser } = useContext(AuthContext);
    
    const [userName, setUserName] = useState(user && user.username);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    function HandleFile(e) {

        if (e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function HandleUpload(){ 
        const currentUid = user.uid;

        const upload = await firebase.storage().ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async() => {
            console.log("Foto enviada com sucesso");

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url) => {
                let urlPhoto = url;
                
                await firebase.firestore().collection('users').doc(user.uid)
                .update({
                    avatarUrl: urlPhoto,
                    username: userName
                })
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: urlPhoto,
                        username: userName
                    };
                    setUser(data);
                    storageUser(data);
                    console.log('salvo com sucesso');
                })
            })
        })
    }
    
    async function HandleSave(e) {
        e.preventDefault();
        
        if(imageAvatar === null && userName !== ''){
            await firebase.firestore().collection('users').doc(user.uid)
            .update({
                username: userName
            })
            .then(() => {
                let data = {
                    ...user,
                    username: userName
                };
                setUser(data);
                storageUser(data);
                console.log('salvo com sucesso')
            });
        }
        else if(userName !== '' && imageAvatar !== null){
            HandleUpload();
        }
    }

   
    return (
        <div>
            <Header />
            <div className="content">
                <Title titleName="Meu Perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={HandleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={HandleFile } /><br/>
                            { avatarUrl === null ?
                            <img src={avatar} width="250" height="250" alt="foto de perfil do usuario" />
                            :
                            <img src={avatarUrl} width="250" height="250" alt="foto de perfil do usuario" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button>Salvar</button>
                    </form>
                </div>
                
                <div className="container">
                    <button className="logout-btn" onClick={ () => SignOut() }>Sair</button>
                </div>


             </div>

        </div>
    )
}
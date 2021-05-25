import { useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import { FiUser } from 'react-icons/fi';
import firebase from '../../Services/firebaseConnection';

export default function Costumer(){
    const [clientName, setClientName] = useState('');
    const [clientCNPJ, setclientCNPJ] = useState('');
    const [clientAddress, setClientAddress] = useState('');

    async function HandleAdd(e){
        e.preventDefault();

        if (clientName !== '' && clientCNPJ !== '' && clientAddress !== ''){
            await firebase.firestore().collection('customers').add({
                name: clientName,
                cnj: clientCNPJ,
                address: clientAddress
            })
            .then(() => { 
                setClientName('');
                setclientCNPJ('');
                setClientAddress('');

                toast.info('Empresa cadastrada com sucesso..')
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastrar');
            });
        }else {
            toast.error('Preencha todos os campos');
        }
        
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title titleName="Clientes">
                    <FiUser size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile customer" onSubmit={HandleAdd}>
                        <label>Nome do Cliente</label>
                        <input type="text" value={clientName} placeholder="nome da sua empresa" onChange={(e) => setClientName(e.target.value)} />
                        <label>CNPJ</label>
                        <input type="number" value={clientCNPJ} placeholder="33.133.034/0001-98" onChange={(e) => setclientCNPJ(e.target.value)} />
                        <label>Endereço</label>
                        <input type="text" value={clientAddress} placeholder="Endereço da empresa" onChange={(e) => setClientAddress(e.target.value)} />
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
            
        </div>
    )
}
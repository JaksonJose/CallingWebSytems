import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import firebase from '../../Services/firebaseConnection';
import { AuthContext } from '../../Contexts/auth';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import './New.css';

export default function New(){
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [subject, setSubject] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complement, setComplement] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);
  
    useEffect(() => {
        async function LoadCustomers(){
            await firebase.firestore().collection('customers').get()
            .then((snapshot) => {

                let list = [];

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        customerName: doc.data().name
                    })
                })

                if(list.length === 0){
                    console.log('nenhuma empresa encontrada');
                    setCustomers([{id: '1', customerName: 'Freela' }])
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(list);
                setLoadCustomers(false)

                if (id) {
                    LoadId(list);
                }
            })
            .catch((error) => {
                console.log('Deu erro', error);
                setLoadCustomers(false);
                setCustomers([{id: '1', customerName: '' }])
            })
        }

        LoadCustomers();
        
    }, [id])

    async function LoadId(list){
        await firebase.firestore().collection('callings').doc(id).get()
        .then((snapshot) => {
            setSubject(snapshot.data().subject);
            setStatus(snapshot.data().status);
            setComplement(snapshot.data().complement);

            let index = list.findIndex(item => item.id === snapshot.data().clientId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((err) => {
            console.log('Erro no ID informado: ', err);
            setIdCustomer(false);
        })
    }

    async function HandleRegister(e){
        e.preventDefault();
        
        //User tries to update the client info.
        if (idCustomer){
            await firebase.firestore().collection('callings').doc(id)
            .update({
                clientId: customers[customerSelected].id,
                clientName: customers[customerSelected].customerName,
                subject: subject,
                status: status,
                complement: complement,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!!!');
                setCustomerSelected(0);
                setComplement('');
                history.push('/dashboard')
            })
            .catch((error) => {
                toast.error('Ops!!! erro ao registrar, tente novamente mais tarde.');
                console.log(error);
            })

            return;
        }

        await firebase.firestore().collection('callings')
        .add({
            created: new Date(),
            clientId: customers[customerSelected].id,
            clientName: customers[customerSelected].customerName,
            subject: subject,
            status: status,
            complement: complement,
            userId: user.uid
        })
        .then(() => {
            toast.success('Chamado registrado com sucesso.')
            setComplement('');
            setCustomerSelected(0);
        })
        .catch((error) => {
            toast.error('Ops!!! Erro ao registrar, tente mais tarde');
            console.log(error);
        })
    }

    function HandleChangeSelect(e){
        setSubject(e.target.value);
    }

    function HandleOptionChange(e){
        setStatus(e.target.value)
    }

    function HandleChangeCustomers (e) {
        //console.log('index selecionado', e.target.value)
        //console.log('cliente selecionado', customers[e.target.value])
        setCustomerSelected(e.target.value);

    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title titleName="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={HandleRegister}>
                        
                        <label>Cliente</label>
                        
                        {loadCustomers ? (
                            <input type="text" disabled={true} value="carregando clientes..." />
                           ) : (
                            <select value={customerSelected} onChange={HandleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.customerName}
                                        </option>
                                    )
                                })}
                            </select>
                            )
                        }

                  
                        <label>Assunto</label>
                        <select value={subject} onChange={HandleChangeSelect}>
                            <option value="suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input type="radio" name="radio" value="Aberto" onChange={HandleOptionChange}
                            checked={status === 'Aberto'} />
                            <span>Em aberto</span>
                            
                            <input type="radio" name="radio" value="Progresso" onChange={HandleOptionChange}
                            checked={status === 'Progresso'} />
                            <span>Em Progresso</span>
                            
                            <input type="radio" name="radio" value="Atendido" onChange={HandleOptionChange}
                            checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type="text" placeholder="Descreva seu problema (opcional)"
                            value={complement} onChange={(e) => setComplement(e.target.value)}
                        />

                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
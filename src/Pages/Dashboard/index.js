import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { format } from 'date-fns';
import firebase from '../../Services/firebaseConnection';
import Header from '../../Components/Header';
import Title from '../../Components/Title';
import Modal from '../../Components/Modal';
import './Dashboard.css';


const listRef = firebase.firestore().collection('callings').orderBy('created', 'desc')

export default function Dashboard() {
    const [callings, setCallings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();
    
    useEffect(() => {
        async function LoadCallings(){
            await listRef.limit(5).get()
            .then((snapshot) => {
                UpdateState(snapshot)
            })
            .catch((err) => {
                console.log('erro ao buscar', err);
                setLoadingMore(false);
            })
        }
        LoadCallings();
    }, []);

   

    async function UpdateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    clientName: doc.data().clientName,
                    clientId: doc.data().clientId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement
                })
            });

            const lastDoc = snapshot.docs[snapshot.docs.length -1]; //getting the last doc fetched

            setCallings(callings => [...callings, ...list]);
            setLastDocs(lastDoc)

        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function HandleMore(){
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5).get()
        .then((snapshot) => {
            UpdateState(snapshot);
        })
    }

    function TogglePostModal(item){
        setShowPostModal(!showPostModal) //change true to false...
        setDetail(item);
    }
    
    if (loading){
        return (
            <div>
                <Header />

                <div className="content">
                    <Title titleName="Atendimentos">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }
   
    return (
        <div>
            <Header />

            <div className="content">
                <Title titleName="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>

                {callings.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>

                        <Link to="/" className="new">
                            <FiPlus size={25} color="#FFF"/>
                            Novo Chamado
                        </Link>
                    </div>
                ): (<>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            Novo Chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {callings.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.clientName}</td>
                                            <td data-label="Assunto">{item.subject}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                            </td>
                                            <td data-label="cadastrado" >{item.createdFormated}</td>
                                            <td data-label="#" >
                                                <button className="action" style={{backgroundColor: '#3583f6'}} onClick={() => TogglePostModal(item)}>
                                                    <FiSearch color='#FFF' size={17} />
                                                </button>
                                                <Link className="action" style={{backgroundColor: '#F6a935'}} to={`new/${item.id}`} >
                                                    <FiEdit2 color='#FFF' size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        { loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className="btn-more" onClick={HandleMore}>Buscar Mais</button> }                        

                    </>)}
            </div>
            
            {showPostModal && (
                <Modal content={detail} close={TogglePostModal}  />
            )}

        </div>
    )
}
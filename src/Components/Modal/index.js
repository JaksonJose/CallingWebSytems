import { FiX } from 'react-icons/fi';
import './Modal.css';

export default function Modal({content, close}){
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={23} color="#FFF" />
                    Voltar
                    </button>

                    <div>
                        <h2>Detalhes do chamado</h2>

                        <div className="row">
                            <span>
                                Cliente: <i>{content.clientName}</i>
                            </span>
                        </div>

                        <div className="row">
                            <span>
                                Assunto: <i>{content.assunto}</i>
                            </span>
                        </div>
                        
                        <div className="row">
                            <span>
                                Cadastrado em: <i>{content.createdFormated}</i>
                            </span>
                        </div>

                        <div className="row">
                            <span>
                                Status: <i style={{color:'#FFF', backgroundColor: content.status === 'Aberto' ? '#5cb85c' :
                                '#999'}}>{content.status}</i>
                            </span>
                        </div>

                        {content.complement !== '' && (
                            <>
                                <h3>Complemento</h3>

                                <p>
                                    {content.complement}
                                </p>
                            </>
                        )}
                        
                    </div>
            </div>
        </div>
    )
}
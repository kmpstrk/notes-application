
interface ModalProps{
    children : React.ReactNode;
    isOpen: boolean;
    onClose: ()=>void;
    onSubmit: (any:any)=>void;
    buttonText: string;
    specialColor?: string;
}

const Modal : React.FC <ModalProps> = ({isOpen, onClose, children, onSubmit, buttonText, specialColor })=>{

    if (!isOpen) return null;

    return( 
            <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content custom-modal">
                        <div className= {`modal-header border-0 color-${specialColor}`}>
                            <button type="button" className="close" onClick={onClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-primary" onClick={onSubmit}>
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    )    
}

export default Modal;
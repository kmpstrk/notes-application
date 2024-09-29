
interface ModalProps{
    children : React.ReactNode;
    isOpen: boolean;
    onClose: ()=>void;
}

const Modal : React.FC <ModalProps> = ({isOpen, onClose, children })=>{

    if (!isOpen) return null;

    return( 
            <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content custom-modal">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={onClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    )    
}

export default Modal;
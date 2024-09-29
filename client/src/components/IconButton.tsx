
interface IconButtonProps{
    type : 'edit' | 'delete';
    className? : string;
    onClick? : (any:any)=> void;
    tooltip? : string;
    disabled? : boolean;
}

const IconButton : React.FC <IconButtonProps> = ({type, className, onClick, tooltip, disabled})=>{
    const icon = type==='edit' ? (<i className="bi bi-pencil"></i>) : (<i className="bi bi-trash"></i>);

    return(
        <button  
            type="button"
            className={`btn ${className}`}
            onClick={onClick}
            disabled={disabled}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={tooltip} >
            
            {icon}
        
        </button>
    )
}


export default IconButton;
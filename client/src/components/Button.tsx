

interface ButtonProps{
    type : 'submit';
    text: string; 
    className? : string;
    onClick? : ()=> void;
    disabled? : boolean;
}

const Button : React.FC <ButtonProps> = ({type, text, className, onClick, disabled})=>{
    return(
        <button
            type={type}
            className= {className}
            disabled = {disabled}
            onClick={onClick}>
                
            {text}
        
        </button>
    )
}


export default Button;
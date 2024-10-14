

interface ButtonProps{
    type? : 'submit'| 'button' | 'reset';
    text: string; 
    className? : string;
    onClick? : (any?:any)=> void;
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

interface AlertProps{
    text: string;
    color : 'danger' | 'secondary';
    margin? : '0' | '1' | '2' | '3' | '4' | '5' ;
}

const Alert : React.FC <AlertProps> = ({text, color, margin})=> {
    
    return (   
        <>
        <div className=" container pt-4 col-12 col-md-5 mt-5">
            <div className={`d-flex justify-content-center fade show mt-${margin? (margin) : ('0')} alert alert-${color}`}>
                {text}
            </div>
        </div>
        </>
    );
  }
  
  export default Alert;
  
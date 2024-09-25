
interface FormattedDateProps{
    date : string;
}

const FormattedDate : React.FC <FormattedDateProps> = ({date})=>{
    const datePart = new Date(parseInt(date)).toLocaleDateString();
    const timePart = new Date(parseInt(date)).toLocaleTimeString();

    return(
        <div className="date-container">
            <p className='date-part'>{datePart}</p>
            <p className='time-part'>{timePart}</p>
        </div>
    )
}

export default FormattedDate;
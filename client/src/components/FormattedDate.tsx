
interface FormattedDateProps{
    date : string;
    className? : string;
}

const FormattedDate : React.FC <FormattedDateProps> = ({date, className})=>{
    const datePart = new Date(parseInt(date)).toLocaleDateString();
    const timePart = new Date(parseInt(date)).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

    return(
            <div className={`d-flex align-items-center ${className}`}>
                    <span className="text-smaller">{datePart}</span>
                    <div className="vr me-2 ms-2"></div>
                    <span className="text-smaller">{timePart}</span>
            </div>
    )
}

export default FormattedDate;
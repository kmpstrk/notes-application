import Button from "./IconButton";
import FormattedDate from "./FormattedDate";

interface NoteProps{
    content : string;
    createdAt : string;
    id : string;
}


const Note : React.FC <NoteProps> = ({content, createdAt, id})=>{

    const handleEdit = ()=>{

    }

    const handleDelete = ()=>{

    }

    
    return (
        <div className="note-container">
            <p className="note-content">{content}</p>
            <FormattedDate date = {createdAt} />
            <Button type = 'edit' className = 'edit-btn' onClick= {handleEdit} tooltip = 'Edit note'/>
            <Button type = 'delete' className = 'edit-btn' onClick= {handleDelete} tooltip = 'Delete note'/>

        </div>
    )
}

export default Note;
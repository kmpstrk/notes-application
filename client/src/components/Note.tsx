import Button from "./Button";

interface NoteProps{
    content : string;
    createdAt : string;
    id : string;
}


const Note : React.FC <NoteProps> = ({content, createdAt, id})=>{
    return (
        <div className="note-container">
            <p className="note-content">{content}</p>
            <p className="note-date">{createdAt}</p>
            <Button />
        </div>
    )
}

export default Note;
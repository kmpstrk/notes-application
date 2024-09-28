import { useState, useRef } from "react";
import Button from "./Button";
import { useMutation, gql } from "@apollo/client";


const ADD_NOTE = gql`
    mutation AddNote($content:String!) {
        addNote (content: $content){
            id
            content
            createdAt
        }
    }`;

const Form : React.FC = ()=> {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [addNote, {loading, error}] = useMutation(ADD_NOTE);
    const [note, setNote] = useState<string>('');

    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error.message);
      return <p>Oops, an error occured</p>;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (note.trim() !== '') {
            try {
                addNote({ variables: { content: note } });
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }
        if (textareaRef.current) textareaRef.current.value = '';
    }

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="note">New note</label>
                <textarea 
                    id="note" name="note"
                    ref = {textareaRef}
                    placeholder="Type your note here..."
                    onChange = {e => setNote(e.target.value)}>
                </textarea>
                
                <Button 
                    text='Add new' 
                    type='submit'/>
            
            </form>
        </div>
    )
}


export default Form;
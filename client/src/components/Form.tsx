import { useState, useRef } from "react";
import Button from "./Button";
import { useMutation, gql } from "@apollo/client";
import {COLORS} from '../colors';


const ADD_NOTE = gql`
    mutation AddNote($content:String! $color:String) {
        addNote (content: $content color:$color){
            id
            content
            createdAt
            color
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


    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        return COLORS[randomIndex];
      };



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (note.trim() !== '') {
            try {
                addNote({ variables: { content: note, color: getRandomColor()} });
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }
        if (textareaRef.current) textareaRef.current.value = '';
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 350)}px`;
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value);
        adjustTextareaHeight(); 
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>)=>{
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        } else {
            adjustTextareaHeight(); 
        }
    }

    return(
        <div className="form-container container pt-2 col-12 col-md-6">
            <form onSubmit={handleSubmit} className="form">
                <div className="mb-3">
                    <label htmlFor="note"></label>
                    <textarea 
                        id="note" name="note"
                        ref = {textareaRef}
                        className="form-control shadow-hover"
                        placeholder="What's on your mind?"
                        onChange = {handleInput} 
                        onKeyDown={handleKeyDown}
                        onBlur={adjustTextareaHeight}
                        >
                    </textarea>
                </div>
                <div className="d-flex justify-content-end mb-4">
                    <Button className='btn btn-outline-primary custom-add-btn' text='Add note' type='submit'/>
                </div>
                
            
            </form>
        </div>
    )
}


export default Form;
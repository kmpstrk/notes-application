import FormattedDate from "./FormattedDate";
import IconButton from "./IconButton";
import { useMutation, gql } from '@apollo/client';
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";



const UPDATE_NOTE = gql`
    mutation UpdateNote($content:String! $id:ID!) {
        updateNote (content: $content id: $id){
            id
            content
            createdAt
        }
    }`;


const DELETE_NOTE = gql`
    mutation DeleteNote($id:ID!) {
        deleteNote (id: $id)
    }`;




interface NoteProps{
    content : string;
    createdAt : string;
    id : string;
}


const Note : React.FC <NoteProps> = ({content, createdAt, id})=>{
    const [deleteNote, {loading, error}] = useMutation(DELETE_NOTE);
    const [editedContent, setEditedContent] = useState<string>(content);
    const [updateNote] = useMutation(UPDATE_NOTE);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    if(loading) return <p>Loading...</p>
    if(error) {
        console.error('Error: ' + error);
        return <p>Oops! Error occured.</p>
    }


    const openEditModal = ()=>{
        setIsModalOpen(true);
    }

    const closeEditModal = ()=>{
        setIsModalOpen(false);
    }

    const handleSavingEditModal = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(editedContent !== content){
            try {
                updateNote({ variables: { content: editedContent, id: id } });
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }


    const childrenOfEditModal = 
        <div>
            <form onSubmit={handleSavingEditModal}>
                <label htmlFor="edit-note"></label>
                <textarea 
                    id="edit-note" 
                    name="edit-note"
                    value = {editedContent}
                    onChange={(e)=>setEditedContent(e.target.value)}>
                </textarea>
                <Button text='Save' type='submit'/>
            </form>
        </div>



    const handleDelete = async ()=>{
        try {
            await deleteNote({ variables: { id: id } });
            window.location.reload();
        } catch (error) {
            console.error('Error: ' + error);
        }
    }

    
    return (
        <div className="note-container">
            <p className="note-content">{content}</p>
            <FormattedDate date = {createdAt} />
            <IconButton type = 'edit' className = 'edit-btn' onClick= {openEditModal} tooltip = 'Edit note'/>
            <IconButton type = 'delete' className = 'edit-btn' onClick= {handleDelete} tooltip = 'Delete note'/>

            <Modal isOpen = {isModalOpen} onClose={closeEditModal} children = {childrenOfEditModal}/>

        </div>
    )
}

export default Note;
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
    color? : string;
}


const Note : React.FC <NoteProps> = ({content, createdAt, id, color})=>{
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
            <div className= {`note-container card shadow-sm border-0 color-${color}`}>
                <div className="card-header border-0">
                    <FormattedDate date = {createdAt} />
                </div>
                <div className="card-body">
                    <p className="note-content card-text">{content}</p>

                </div>

                <div className='card-footer d-flex align-items-center  border-0 invisible-footer justify-content-end'>
                        <IconButton type = 'edit' className = 'edit-btn btn-icon ms-2 btn-custom' onClick= {openEditModal} tooltip = 'Edit note'/>
                        <IconButton type = 'delete' className = 'delete-btn btn-icon ms-2 btn-custom' onClick= {handleDelete} tooltip = 'Delete note'/>                   
                </div>

                <Modal isOpen = {isModalOpen} onClose={closeEditModal} children = {childrenOfEditModal}/>

            </div>
    )
}

export default Note;
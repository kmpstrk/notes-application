import FormattedDate from "./FormattedDate";
import IconButton from "./IconButton";
import { useMutation, gql } from '@apollo/client';
import Modal from "./Modal";
import { useRef, useState } from "react";



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
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);


    if(loading) return <p>Loading...</p>
    if(error) {
        console.error('Error: ' + error);
        return <p>Oops! Error occured.</p>
    }


    const adjustTextareaHeight = ()=>{
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 500)}px`;
        }
    }


    const openEditModal = ()=>{
        setIsEditModalOpen(true);
        setTimeout(() => {
            adjustTextareaHeight(); 
        }, 0);
    }

    const closeEditModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsEditModalOpen(false);
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
            <FormattedDate date = {createdAt} className='pb-1'/>
            <form>
                <label htmlFor="edit-note"></label>
                <textarea 
                    id="edit-note" 
                    name="edit-note"
                    ref = {textareaRef}
                    value = {editedContent}
                    onChange={(e)=>setEditedContent(e.target.value)}
                    onInput={adjustTextareaHeight} 
                    className= "form-edit border-0"
                    >
                </textarea>
            </form>
        </div>


    const openDeleteModal = ()=>{
        setIsDeleteModalOpen(true);
    }

    const closeDeleteModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsDeleteModalOpen(false);
    }
        


    const handleDelete = async ()=>{
        try {
            await deleteNote({ variables: { id: id } });
            window.location.reload();
        } catch (error) {
            console.error('Error: ' + error);
        }
    }

    return (
            <div 
                className= {`note-container card shadow-sm border-0 color-${color}`}
                onClick={openEditModal}
            >
                <div className="card-header border-0">
                    <FormattedDate date = {createdAt} />
                </div>
                <div className="card-body">
                    <p className="note-content card-text">{content}</p>

                </div>

                <div 
                    className='card-footer d-flex align-items-center  border-0 invisible-footer justify-content-end'
                    onClick={(e) => e.stopPropagation()}>                      
                        <IconButton type = 'delete' 
                            className = 'delete-btn btn-icon ms-2 btn-custom' 
                            onClick= {(e) => {
                                e.stopPropagation();
                                openDeleteModal();
                            }}
                            tooltip = 'Delete note'/>                   
                </div>

                <Modal 
                    isOpen = {isEditModalOpen} 
                    onClose={closeEditModal} 
                    children = {childrenOfEditModal}
                    onSubmit={handleSavingEditModal}
                    buttonText="Save"
                    specialColor= {color}
                />

                <Modal 
                    isOpen = {isDeleteModalOpen} 
                    onClose={closeDeleteModal} 
                    children = {<p className="text-center">Are you sure you want to delete this note?</p>}
                    onSubmit={handleDelete}
                    buttonText="Delete"
                />

            </div>
    )
}

export default Note;
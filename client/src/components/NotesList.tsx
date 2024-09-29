import { useState } from "react";
import Note from "./Note";
import { useQuery, gql, useSubscription } from '@apollo/client';


const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      content
      createdAt
      color
    }
  }
`;



const NOTE_ADDED = gql`
    subscription NoteAdded {
        noteAdded {
            id
            content
            createdAt
            color
        }
    }
`;


const NoteList : React.FC = ()=>{

    const { loading, error, data, refetch } = useQuery(GET_NOTES);
    const { data: subscriptionData } = useSubscription(NOTE_ADDED);

    const newNote = subscriptionData?.noteAdded;
    if(newNote){
      refetch();
    }


    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error(error.message);
      return <p>Oops, loading error</p>
    }


    
    return (
      <div className="note-list-container row g-3"> 
        {data?.notes?.slice().reverse().map((note: any) => (
          <div key={note.id} className="col-12 col-md-3">
            <Note content={note.content} createdAt={note.createdAt} id={note.id} color={note.color}/>
          </div>
        ))}
      </div>
    )
}


export default NoteList;
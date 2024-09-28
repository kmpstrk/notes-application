import Note from "./Note";
import { useQuery, gql, useSubscription } from '@apollo/client';


const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      content
      createdAt
    }
  }
`;



const NOTE_ADDED = gql`
    subscription NoteAdded {
        noteAdded {
            id
            content
            createdAt
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


    
    return(
        <div className="note-list-container">
            <ul>
                {data?.notes?.map((note: any) => (
                    <li key={note.id}>
                        <Note content={note.content} createdAt={note.createdAt} id={note.id} />
                    </li>
        
                ))}
            </ul>
            
        </div>
    )
}


export default NoteList;
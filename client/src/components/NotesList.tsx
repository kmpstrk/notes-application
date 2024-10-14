import Note from "./Note";
import { useQuery, gql } from '@apollo/client';
import Loading from "./Loading";
import Alert from "./Alert";


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

    const { loading, error, data } = useQuery(GET_NOTES);
    //const { data: subscriptionData } = useSubscription(NOTE_ADDED);

    if (loading) return <Loading/>;
    if (error) {
      console.error(error.message);
      return <Alert color= 'secondary' text="No notes yet" />;
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
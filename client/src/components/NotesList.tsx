import Note from "./Note";
import { useQuery, gql } from '@apollo/client';


const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      content
      createdAt
    }
  }
`;



const NoteList : React.FC = ()=>{

    const { loading, error, data } = useQuery(GET_NOTES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


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
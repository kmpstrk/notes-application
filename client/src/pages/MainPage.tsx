import NoteList from '../components/NotesList';
import Form from '../components/Form';

function MainPage() {
  return (    
      <div className="container">
        <Form />
        <NoteList />
      </div>
   
  );
}

export default MainPage;

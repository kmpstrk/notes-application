import './styles/App.css';
import './styles/components.css'
import NoteList from './components/NotesList';
import Form from './components/Form';

function App() {
  return (

      <div className="container">
        <Form />
        <NoteList />
        
      </div>

   
  );
}

export default App;

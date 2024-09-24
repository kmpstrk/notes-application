import React from 'react';
import './App.css';
import NoteList from './components/NotesList';
import Form from './components/Form';

function App() {
  return (
    <div className="App">
      <Form />
      <NoteList />
      
    </div>
  );
}

export default App;

const express = require('express');
const { buildSchema, defaultTypeResolver } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
        return Note.find();
    })
    .then(notes => {
        console.log('Existing notes:', notes);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });



const noteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);



const schema = buildSchema(`
    type Note {
        id: ID!
        content: String!
        createdAt: String!
    }

    type Query {
        notes: [Note]
    }

    type Mutation {
        addNote(content: String!) : Note
        deleteNote(id: ID!) : Boolean
        updateNote(id:ID! content:String!) : Note
    }
`);


const root = {
    
    notes: async ()=> await Note.find(),
   
        
    addNote: async ({ content }) => {
        try{
            const newNote = new Note({ content });
            await newNote.save();
            return newNote;
        }catch (err){
            console.error("Error adding note:", err);
            throw new Error("Failed to add the note. Please try again.");
        }
    },


    deleteNote: async ({id})=>{
        try{
            const res = await Note.findByIdAndDelete(id);
            return res !== null;
        } catch (err){
            console.error("Error deleting note:", err);
            throw new Error("Failed to delete the note. Please try again.");
        }
    },


    updateNote: async ({id, content}) => {
        try{
            const updatedNote = await Note.findByIdAndUpdate(id, {content}, { new: true });
            return updatedNote;
        } catch (err){
            console.error("Error updating note:", err);
            throw new Error("Failed to edit the note. Please try again.");
        }
    }

};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server is running on http://localhost:4000/graphql'));

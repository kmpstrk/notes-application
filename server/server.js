const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
require('dotenv').config();
const { PubSub } = require('graphql-subscriptions');


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


const noteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now },
});
const Note = mongoose.model('Note', noteSchema);


const pubsub = new PubSub();



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
        addNote(content: String!): Note
        deleteNote(id: ID!): Boolean
        updateNote(id: ID!, content: String!): Note
    }

    type Subscription {
        noteAdded: Note
    }
`);


const root = {
    notes: async () => await Note.find(),
    addNote: async ({ content }) => {
        console.log('addNote resolver called with content:', content);
        const newNote = new Note({ content });
        await newNote.save();
        console.log('Publishing new note:', newNote);
        const published = pubsub.publish('NOTE_ADDED', { noteAdded: newNote });
        if (published) {
            console.log('Note published successfully!');
        } else {
            console.log('Failed to publish note.');
        }
        const iter = pubsub.asyncIterator(['NOTE_ADDED']);
        if (iter) {
            console.log('Note iterator successfully!');
        } else {
            console.log('Failed iterator.');
        }
        return newNote;
    },
    deleteNote: async ({ id }) => {
        const res = await Note.findByIdAndDelete(id);
        return res !== null;
    },
    updateNote: async ({ id, content }) => {
        const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });
        return updatedNote;
    },
    nodeAdded : () => {
        console.log('in there'); // This should log when a subscription is made
        return pubsub.asyncIterator(['NOTE_ADDED']); // Return the async iterator
    },
};


const app = express();
app.use(cors());

const httpServer = createServer(app);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));


const subscriptionServer = SubscriptionServer.create(
    {   schema,
        execute,
        subscribe,
    },
    {   server: httpServer,
        path: '/graphql',
    }
);


httpServer.listen({ port: 4000 }, () => {
    console.log(`Server is running on http://localhost:4000/graphql`);
});

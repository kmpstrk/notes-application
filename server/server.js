const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


const noteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now },
    color: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Note = mongoose.model('Note', noteSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

const secretKey = process.env.JWT_SECRET;


const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    secretKey,
    { expiresIn: '1d' }
  );
};


const authenticate = (req) => {
    const token = req.headers.authorization || '';
    if (!token) throw new Error('Unauthorized');
  
    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), secretKey);
      return decodedToken;
    } catch (err) {
      throw new Error('Invalid/Expired token');
    }
  };
  


const schema = buildSchema(`
    type Note {
        id: ID!
        userId: ID!
        content: String!
        createdAt: String!
        color : String
    }
    
    type User {
        id: ID!
        username: String!
    }

    type Query {
        notes: [Note]
        currentUser: User!
    }

    type Mutation {
        addNote(content: String!, color:String): Note
        deleteNote(id: ID!): Boolean
        updateNote(id: ID!, content: String!): Note

        signup(username: String!, password: String!): AuthPayload!
        login(username: String!, password: String!): AuthPayload!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

`);


const root = {
  signup: async ({ username, password }) => {
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error('User already exists');
      const user = new User({ username, password });
      await user.save();
      const token = createToken(user);
      return { token, user };
    } catch(err){
      console.log("Signup error:", err);
      throw new Error('Failed to sign up user');
    }
  },
      
  login: async ({ username, password }) => {
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.isValidPassword(password))) {
          throw new Error('Invalid username or password');
      }
      const token = createToken(user);
      return { token, user };
    }catch(err){
      console.log("Login error:", err);
      throw new Error('Failed to log in');
    }
  },
    
  currentUser: async (args, req) => {
    const decodedUser = authenticate(req);
    return await User.findById(decodedUser.userId);
  },


  notes: async (args, req) => {
    const decodedUser = authenticate(req);
    return await Note.find({ userId: decodedUser.userId });
  },

  addNote: async ({ content, color }, req) => {
    console.log('server: ', content)
    const decodedUser = authenticate(req);
    try {
      const newNote = new Note({ content, color, userId: decodedUser.userId });
      await newNote.save();
    
      return newNote;

    } catch(err){
      console.log("Creating note error:", err);
      throw new Error('Failed to create a note');
    }
  },

  deleteNote: async ({ id }) => {
    try {const res = await Note.findByIdAndDelete(id);
        return res !== null;
    } catch (err){
        console.log("Deleting note error:", err);
        throw new Error('Failed to delete a note');
    }
  },

  updateNote: async ({ id, content }) => {
    try {const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });
        return updatedNote;
    } catch(err){
        console.log("Updating note error:", err);
        throw new Error('Failed to update a note');
    }
  },
};


const httpServer = createServer(app);

app.use('/graphql',  graphqlHTTP((req) => {
    const token = req.headers.authorization || '';
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      } catch (err) {
        console.log('Invalid/Expired token');
        throw new Error('UNAUTHENTICATED')
      }
    }

    return {
      schema,
      rootValue: root,
      graphiql: true,
      context: { user: authenticate(req) },
    };
}));


httpServer.listen({ port: 4000 }, () => {
    console.log(`Server is running on http://localhost:4000/graphql`);
});

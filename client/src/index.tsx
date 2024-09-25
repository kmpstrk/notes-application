import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!); 

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
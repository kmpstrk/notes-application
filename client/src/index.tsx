import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, gql } from '@apollo/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});
console.log(client)


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!); 

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
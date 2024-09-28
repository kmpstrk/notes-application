import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, split, HttpLink } from '@apollo/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';


const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
    }
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});


const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink, // WebSocket link for subscriptions
    httpLink // HTTP link for queries and mutations
);


const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});



const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);


root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
};

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
    return {
        headers: {
            ...headers,
            authorization: token,
        },
    };
});

console.log(localStorage.getItem('token'));


const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
            if (message === 'UNAUTHENTICATED') {
                console.log("Authentication error, invalid/expired token");
                localStorage.removeItem('token');
                window.location.href = "/login"; 
            }
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});



const link = errorLink.concat(authLink.concat(httpLink));

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const API_URL = 'http://localhost:4000';

export const client = new ApolloClient({
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache(),
});

import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  // Apollo Client setup with HTTP Link
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI || 'http://localhost:4000/graphql',
  });

  // Adding API key to headers
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `ApiKey ${process.env.API_KEY}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div>
        <Header />
        <div>
          <Outlet />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
};

export default App;
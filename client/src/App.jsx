import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Auth from './utils/auth';
import './App.css';

const App = () => {
  const httpLink = createHttpLink({
    uri: 'https://taste-voyage.onrender.com/graphql',  // Use environment variable for deployment
  });

  // Add JWT token to headers if user is logged in
  const authLink = setContext((_, { headers }) => {
    const token = Auth.getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',  // Correct token format
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="app-container" >
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
};

export default App;

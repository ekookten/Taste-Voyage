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
    uri: 'https://taste-voyage.onrender.com/graphql',  


  });

  
  // Set up the context to include the JWT token in the headers if the user is logged in
  const authLink = setContext((_, { headers }) => {
    const token = Auth.getToken(); // Retrieve the token from local storage
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',  // Set the authorization header if the token exists
      },
    };
  });

  // Create an Apollo Client instance with the HTTP link and caching
  const client = new ApolloClient({
    link: authLink.concat(httpLink), // Combine the auth link and the HTTP link
    cache: new InMemoryCache(), // Set up in-memory caching for Apollo
  });

  return (
    // Provide the Apollo Client to the entire app
    <ApolloProvider client={client}>
      <div className="app-container">
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

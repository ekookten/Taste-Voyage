const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth'); // Middleware for authentication

const { typeDefs, resolvers } = require('./schema'); // GraphQL schema
const db = require('./config/connection'); // Database connection

const PORT = process.env.PORT || 4001; // Set port to environment variable or default to 4001
const app = express(); // Create an instance of Express
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo Server and Express app
const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();

  // Middleware to parse incoming requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Setup GraphQL endpoint with authentication middleware
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware // Attach auth middleware to context
  }));

  // Serve static files if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist'))); // Serve static assets from the client build

    // Serve index.html for any routes not handled by the API
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();

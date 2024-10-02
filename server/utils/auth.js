const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Secret key and expiration time for the JWT
const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  // Custom error for unauthenticated access
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // Middleware to authenticate the user using JWT
  authMiddleware: function ({ req }) {
    // Retrieve the token from various sources
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If authorization header is present, extract the token
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim(); // Extracts token from "Bearer <token>"
    }

    // If no token, return the request as is
    if (!token) {
      return req;
    }

    try {
      // Verify the token and extract user data
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach user data to the request object
    } catch {
      console.log('Invalid token'); // Log invalid token attempts
    }

    return req; // Return the modified request object
  },

  // Function to sign a new token
  signToken: function ({ email, username, _id }) {
    // Create a payload with user data
    const payload = { email, username, _id };
    // Sign and return a new JWT
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

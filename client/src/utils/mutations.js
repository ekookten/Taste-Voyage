import { gql } from "@apollo/client";

// Mutation to save a recipe for the logged-in user
export const SAVE_RECIPE = gql`
  mutation saveRecipe($recipeData: recipeInput!) {
    saveRecipe(recipeData: $recipeData) {
      _id
      username
      savedRecipes {
        _id
        title
        image
      }
    }
  }
`;

// Mutation to remove a recipe from the saved list
export const REMOVE_RECIPE = gql`
  mutation removeRecipe($recipeId: String!) {
    removeRecipe(recipeId: $recipeId) {
      _id
      username
      savedRecipes {
        _id
        summary
        title
        authors
        image
        comment {
          commentText
          commentAuthor
          createdAt
        }
        instructions {
          text
          step
        }
        ingredients {
          name
          unit
          quantity
        }
      }
    }
  }
`;

// Mutation to add a new user
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation to log in an existing user
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

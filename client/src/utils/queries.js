import { gql } from "@apollo/client";

// Query to get the current user's information, including their saved and secret recipes
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      savedRecipes {
        _id
        title
        image
        recipeId
      }
      secretRecipes {
        _id
        title
        username
        image
        ingredients {
          _id
        }
        instructions {
          _id
        }
      }
    }
  }
`;

// Query to get all users and their secret recipes
export const GET_USERS = gql`
  query users {
    users {
      _id
      username
      secretRecipes {
        _id
        title
        username
        image
        ingredients {
          unit
          name
          quantity
          _id
        }
        instructions {
          step
          text
          _id
        }
      }
    }
  }
`;

// Query to get a specific secret recipe by its ID
export const GET_SECRET_RECIPE = gql`
  query getSecretRecipe($recipeId: ID!) {
    getSecretRecipe(recipeId: $recipeId) {
      _id
      title
      image
      ingredients {
        name
        unit
        quantity
      }
      instructions {
        step
        text
      }
      comments {
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

// Query to get a specific recipe's basic information by its ID
export const GET_RECIPE = gql`
  query recipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      _id
      title
      image
    }
  }
`;

// Query to get a user's information, including their saved recipes, by username
export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      savedRecipes {
        _id
        title
        image
        recipeId
      }
    }
  }
`;

// Query to get recipes created by a specific user
export const GET_RECIPES_BY_USER = gql`
  query recipes($username: String) {
    recipes(username: $username) {
      _id
      title
      summary
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
`;

import { gql } from "@apollo/client";

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
        recipeId
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
export const GET_SECRET_RECIPE = gql`
  query getSecretRecipe($recipeId: ID!) {
    getSecretRecipe(recipeId: $recipeId) {
      _id
      recipeId
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
    }
  }
`;
export const GET_RECIPE = gql`
    query recipe($recipeId: ID!) {
        recipe(recipeId: $recipeId) {
          _id
          title
          image
        }
    }
    `;
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



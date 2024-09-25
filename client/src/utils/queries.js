import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
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
  
`;
export const GET_RECIPE = gql`
    query recipe($recipeId: ID!) {
        recipe(recipeId: $recipeId) {
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
    export const GET_USER = gql`
    query user($username: String!) {
        user(username: $username) {
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
    


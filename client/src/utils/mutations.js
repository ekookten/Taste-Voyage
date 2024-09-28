import { gql , useMutation} from "@apollo/client";



export const ADD_SECRET_RECIPE = gql`
    mutation addSecretRecipe($secretRecipeData: secretRecipeInput!) {
        addSecretRecipe(secretRecipeData: $secretRecipeData) { 
            _id
            title
            ingredients{
                name
                unit
                quantity
            } 
            instructions{
                text
                step
            }
        }
    }
`;
export const ADD_INGREDIENT = gql`
    mutation addIngredient($name: String!, $unit: String!, $quantity: Float!) {
        addIngredient(name: $name, unit: $unit, quantity: $quantity) {
            _id
            name
            unit
            quantity
        }
    }
`;
export const ADD_INSTRUCTION = gql`
    mutation addInstruction($step: String!, $text: String!) {
        addInstruction(step: $step, text: $text) {
            _id
            step
            text
        }
    }
`;
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
        recipeId
      }
    }
  }
`;

// Mutation to remove a recipe from the saved list
export const REMOVE_RECIPE = gql`
  mutation removeRecipe($recipeId: ID!) {
    removeRecipe(recipeId: $recipeId) {
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

export const REMOVE_SECRET_RECIPE = gql`
  mutation removeRecipe($recipeId: ID!) {
    removeRecipe(recipeId: $recipeId) {
      _id
      title
      author
      ingredients{
          name
          unit
          quantity
      } 
      instructions{
          text
          step
      }
      image
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



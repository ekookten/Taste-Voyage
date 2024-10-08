import { gql, useMutation } from "@apollo/client";

// Mutation to add a new secret recipe
export const ADD_SECRET_RECIPE = gql`
  mutation addSecretRecipe($secretRecipeData: secretRecipeInput!) {
    addSecretRecipe(secretRecipeData: $secretRecipeData) {
      _id
      title
      username
      ingredients {
        _id
        name
        unit
        quantity
      }
      instructions {
        _id
        text
        step
      }
    }
  }
`;

// Mutation to remove an existing secret recipe
export const REMOVE_SECRET_RECIPE = gql`
  mutation removeSecretRecipe($recipeId: ID!) {
    removeSecretRecipe(recipeId: $recipeId) {
      _id
      username
      secretRecipes {
        _id
        title
        image
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

// Mutation to remove a saved recipe
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

// Mutation to add a new ingredient to a recipe
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

// Mutation to add a new instruction to a recipe
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

// Mutation to add a new user
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation to add a comment to a recipe
export const ADD_COMMENT = gql`
  mutation addComment(
    $recipeId: ID!
    $commentText: String!
    $commentAuthor: String
    $createdAt: String
  ) {
    addComment(
      recipeId: $recipeId
      commentText: $commentText
      commentAuthor: $commentAuthor
      createdAt: $createdAt
    ) {
      _id
      commentText
      commentAuthor
      createdAt
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

// Mutation to remove an ingredient from a recipe
export const REMOVE_INGREDIENT = gql`
  mutation removeIngredient($ingredientId: ID!) {
    removeIngredient(ingredientId: $ingredientId) {
      _id
      name
      unit
      quantity
    }
  }
`;

// Mutation to remove an instruction from a recipe
export const REMOVE_INSTRUCTION = gql`
  mutation removeInstruction($instructionId: ID!) {
    removeInstruction(instructionId: $instructionId) {
      _id
      step
      text
    }
  }
`;

// Mutation to update an existing ingredient
export const UPDATE_INGREDIENT = gql`
  mutation updateIngredient(
    $ingredientId: ID!
    $name: String!
    $unit: String!
    $quantity: Float!
  ) {
    updateIngredient(
      ingredientId: $ingredientId
      name: $name
      unit: $unit
      quantity: $quantity
    ) {
      _id
      name
      unit
      quantity
    }
  }
`;

// Mutation to update an existing instruction
export const UPDATE_INSTRUCTION = gql`
  mutation updateInstruction(
    $instructionId: ID!
    $text: String!
    $step: String!
  ) {
    updateInstruction(instructionId: $instructionId, text: $text, step: $step) {
      _id
      text
      step
    }
  }
`;

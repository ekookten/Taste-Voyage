const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    savedRecipes: [Recipe]
    secretRecipes: [SecretRecipe]
  }

  type Recipe {
    _id: ID
    title: String
    username: String
    author: String
    ingredients: [Ingredient]
    instructions: [Instruction]
    image: String
    recipeId: Int
  }

  type SecretRecipe {
    _id: ID
    title: String
    username: String
    ingredients: [Ingredient]
    instructions: [Instruction]
    image: String
    comments: [Comment]
  }

  type Comment {
    _id: ID
    recipeId: ID!
    commentText: String!
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User                     // Fetch a user by username
    recipes(username: String): [Recipe]                // Fetch all recipes or filter by username
    recipe(recipeId: ID!): Recipe                      // Fetch a single recipe by ID
    me: User                                           // Fetch the currently logged-in user
    users: [User]                                     // Fetch all users
    getSecretRecipe(recipeId: ID!): SecretRecipe      // Fetch a secret recipe by ID
  }

  type Ingredient {
    _id: ID!
    name: String!
    unit: String!
    quantity: Float!
  }

  type Instruction {
    _id: ID!
    text: String!
    step: String!
  }

  input recipeInput {
    title: String!
    image: String 
    recipeId: Int!              
  }

  input secretRecipeInput {
    title: String!
    ingredients: [IngredientInput!]! 
    instructions: [InstructionInput!]!   
    image: String 
  }

  input IngredientInput {
    name: String!
    unit: String!
    quantity: Float!          
  }

  input InstructionInput {
    step: String!
    text: String!
  }

  input commentInput { 
    commentText: String!
    createdAt: String!
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth          // Register a new user
    login(email: String!, password: String!): Auth                               // Log in a user
    saveRecipe(recipeData: recipeInput!): User                                   // Save a recipe for the logged-in user
    addSecretRecipe(secretRecipeData: secretRecipeInput!): SecretRecipe          // Add a new secret recipe
    addComment(recipeId: ID!, commentText: String!, commentAuthor: String, createdAt: String): Comment // Add a comment to a recipe
    addIngredient(name: String!, unit: String!, quantity: Float!): Ingredient    // Add a new ingredient
    addInstruction(text: String!, step: String!): Instruction                    // Add a new instruction
    removeRecipe(recipeId: ID!): User                                            // Remove a saved recipe
    removeSecretRecipe(recipeId: ID!): User                                       // Remove a secret recipe
    removeComment(recipeId: ID!, commentId: ID!): Recipe                        // Remove a comment from a recipe
    removeIngredient(ingredientId: ID!): Ingredient                               // Remove an ingredient by ID
    removeInstruction(instructionId: ID!): Instruction                            // Remove an instruction by ID
    updateIngredient(ingredientId: ID!, name: String!, unit: String!, quantity: Float!): Ingredient // Update an ingredient
    updateInstruction(instructionId: ID!, text: String!, step: String!): Instruction // Update an instruction
  }
`;

module.exports = typeDefs;

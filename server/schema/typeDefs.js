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
    commentText: String!
    commentAuthor: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User
    recipes(username: String): [Recipe]
    recipe(recipeId: ID!): Recipe
    me: User
    users: [User]
    getSecretRecipe(recipeId: ID!): SecretRecipe

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
    step: Int!
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
    quantity: String!
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
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveRecipe(recipeData: recipeInput!): User
    addSecretRecipe(secretRecipeData: secretRecipeInput!): SecretRecipe
    addComment(commentText: String!, commentAuthor: String, createdAt: String ): Comment
    addIngredient(name: String!, unit: String!, quantity: Float!): Ingredient
    addInstruction(text: String!, step: String!): Instruction
    removeRecipe(recipeId: ID!): User
    removeSecretRecipe(recipeId: ID!): User
    removeComment(recipeId: ID!, commentId: ID!): Recipe
    removeIngredient(ingredientId: ID!): Ingredient
    removeInstruction(instructionId: ID!): Instruction
    updateIngredient(ingredientId: ID!, name: String!, unit: String!, quantity: Float!): Ingredient
    updateInstruction(instructionId: ID!, text: String!, step: String!): Instruction
  }
`;

module.exports = typeDefs;

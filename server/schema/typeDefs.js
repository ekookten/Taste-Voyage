const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    savedRecipes: [Recipe]
  }

  type Recipe {
    _id: ID
    username: String
    savedRecipes: [Recipe]
    title: String
    image: String   
  }

  type Comment {
    _id: ID
    commentText: String
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
  }

  type Ingredient {
    _id: ID!
   name: String!
   unit: String
   quantity: String!
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

input IngredientInput {
name: String!
unit: String!
quantity: Int!
}

input InstructionInput {
step: Int!
text: String!
}

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveRecipe(recipeData : recipeInput!): Recipe
    addRecipe(recipeData: recipeInput!): Recipe

    addComment(recipeId: ID!, commentText: String!): Recipe
    removeRecipe(recipeId: ID!): Recipe
    removeComment(recipeId: ID!, commentId: ID!): Recipe
  }
`;

module.exports = typeDefs;

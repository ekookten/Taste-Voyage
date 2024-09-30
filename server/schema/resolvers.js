const { User, Recipe, Ingredient, Instruction, SecretRecipe } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { Types } = require('mongoose');

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("savedRecipes");
    },
    recipes: async (parent, { username }) => {
      // Changed from 'thoughts' to 'recipes'
      const params = username ? { username } : {};
      return Recipe.find(params).sort({ createdAt: -1 });
    },
    getSecretRecipe: async (parent, { recipeId }, context) => {
      const recipe = await SecretRecipe.findById(recipeId)
        .populate("ingredients") // Populates the ingredient details
        .populate("instructions"); // Populates the instruction details
    
      if (!recipe) {
        throw new Error("Recipe not found");
      }
    
      return recipe;
    },
    recipe: async (parent, { recipeId }) => {
      // Changed from 'thought' to 'recipe'
      return Recipe.findOne({ _id: recipeId })
        .populate("authors")
        .populate("ingredients")
        .populate("instructions")
        .populate("comments");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedRecipes").populate("secretRecipes");
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    saveRecipe: async (parent, { recipeData }, context) => {
      if (context.user) {
        const { recipeId, title, image } = recipeData;
    
        let recipe = await Recipe.findOne({ recipeId });
    
        if (!recipe) {
          recipe = await Recipe.create({ recipeId, title, image }); // No summary field here
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedRecipes: recipe._id, recipeData } },
          { new: true, runValidators: true }
        ).populate("savedRecipes");
    
        return updatedUser;
      }
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addComment: async (parent, { recipeId, commentText }, context) => {
      if (context.user) {
        return Recipe.findOneAndUpdate(
          { _id: recipeId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    addSecretRecipe: async (parent, { secretRecipeData }, context) => {
      if (!context.user) {
          throw new AuthenticationError("Authentication required");
      }
  
      try {
          // Validate secretRecipeData
          if (!secretRecipeData.title || !secretRecipeData.ingredients || !secretRecipeData.instructions) {
              throw new Error("Title, ingredients, and instructions are required.");
          }
  
          // Create each ingredient and store its ID
          const ingredientIds = await Promise.all(
              secretRecipeData.ingredients.map(async (ingredient) => {
                  const { name, unit, quantity } = ingredient;
                  if (!name || !unit || quantity === undefined) {
                      throw new Error("All ingredient fields must be provided.");
                  }
                  const newIngredient = await Ingredient.create({ name, unit, quantity });
                  return newIngredient._id;
              })
          );
  
          // Create each instruction and store its ID
          const instructionIds = await Promise.all(
              secretRecipeData.instructions.map(async (instruction) => {
                  const { step, text } = instruction;
                  if (!step || !text) {
                      throw new Error("All instruction fields must be provided.");
                  }
                  const newInstruction = await Instruction.create({ step, text });
                  return newInstruction._id;
              })
          );
  
          // Create the secret recipe using the ingredient and instruction IDs
          const recipe = await SecretRecipe.create({
              title: secretRecipeData.title,
              author: context.user.username,
              ingredients: ingredientIds, // Store array of ObjectId references
              instructions: instructionIds, // Store array of ObjectId references
              image: secretRecipeData.image,
          });
  
          // Update the user's secret recipes array
          await User.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { secretRecipes: recipe._id } },
              { new: true }
          );
  
          // Return the full recipe with populated ingredients and instructions
          const fullRecipe = await SecretRecipe.findById(recipe._id)
              .populate("ingredients")
              .populate("instructions");
  
          return fullRecipe;
  
      } catch (error) {
          console.error("Error adding recipe:", error);
          throw new Error("Could not add the recipe. Please try again.");
      }
  },
  
  addIngredient: async (_, { name, unit, quantity }) => {
    const newIngredient = await Ingredient.create({ name, unit, quantity });
    return newIngredient;
},
addInstruction: async (_, { step, text }) => {

    const newInstruction = await Instruction.create({ text, step });
    return newInstruction;
},
removeSecretRecipe: async (parent, { recipeId }, context) => {
  if (context.user) {
    const recipe = await SecretRecipe.findOneAndDelete({
      _id: recipeId,
      recipeAuthor: context.user.username,
    });

    await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { secretRecipes: recipeId} }
    );

    return recipe;
  }
  throw AuthenticationError;
},

    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.user) {
        const recipe = await Recipe.findOneAndDelete({
          _id: recipeId,
          recipeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRecipes: recipeId} }
        );

        return recipe;
      }
      throw AuthenticationError;
    },
    removeComment: async (parent, { recipeId, commentId }, context) => {
      if (context.user) {
        return Recipe.findOneAndUpdate(
          { _id: recipeId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
    removeIngredient: async (parent, { ingredientId }) => {
      return Ingredient.findOneAndDelete({ _id: ingredientId });
    },
    removeInstruction: async (parent, { instructionId }) => {
      return Instruction.findOneAndDelete({ _id: instructionId });
    },
    updateIngredient: async (parent, { ingredientId, name, unit, quantity }) => {
      return Ingredient.findOneAndUpdate(
        { _id: ingredientId },
        { name, unit, quantity },
        { new: true }
      );
    },
    updateInstruction: async (parent, { instructionId, text, step }) => {
      return Instruction.findOneAndUpdate(
        { _id: instructionId },
        { text, step },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;

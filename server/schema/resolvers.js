const { User, Recipe, Ingredient, Instruction, SecretRecipe } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

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
        return User.findOne({ _id: context.user._id }).populate("savedRecipes");
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
  
      // Ensure each ingredient has the right properties
      const ingredients = await Promise.all(
          secretRecipeData.ingredients.map(async (ingredient) => {
              const { name, unit, quantity } = ingredient;
              // Create the ingredient with the correct structure
              return await Ingredient.create({ name, unit, quantity });
          })
      );
  
      // Process instructions
      const instructions = await Promise.all(
        secretRecipeData.instructions.map(async (instruction) => {
              const newInstruction = await Instruction.create(instruction);
              return newInstruction._id;
          })
      );
  
      // Create the recipe
      const recipe = await SecretRecipe.create({
          title: secretRecipeData.title,
          author: context.user.username,
          ingredients,
          instructions,
          image: secretRecipeData.image,
          recipeId: secretRecipeData.recipeId
      });
  
      // Update the user's savedRecipes
      await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedRecipes: recipe._id } },
          { new: true }
      );
  
      // Fetch the full recipe including populated ingredients and instructions
      const fullRecipe = await SecretRecipe.findById(recipe._id)
          .populate("ingredients")
          .populate("instructions");
  
      return fullRecipe; // Return the full recipe with populated ingredients
  },
  addIngredient: async (_, { name, unit, quantity }) => {
    const newIngredient = await Ingredient.create({ name, unit, quantity });
    return newIngredient;
},
addInstruction: async (_, { step, text }) => {

    const newInstruction = await Instruction.create({ text, step });
    return newInstruction;
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
  },
};

module.exports = resolvers;

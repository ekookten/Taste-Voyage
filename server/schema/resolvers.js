const { User, Recipe , Ingredient, Instruction} = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("savedRecipes");
    },
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
    addRecipe: async (parent, args, context) => {
      try {
        const ingredientIds = await Promise.all(
          args.recipeInput.ingredients.map(async (ingredient) => {
            const newIngredient = await Ingredient.create(ingredient);
            return newIngredient._id;
          })
        );

        const recipe = await Recipe.create({
          ...args.recipeInput,
          ingredients: ingredientIds,
        });

        // Fetch the full recipe including the populated ingredients
        const fullRecipe = await Recipe.findById(recipe._id).populate('ingredients');

        return fullRecipe; // Return the full recipe with populated ingredients
      } catch (error) {
        console.error('Error:', error);
        throw new Error(error.message);
      }
    },
    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.user) {
        const recipe = await Recipe.findOneAndDelete({
          _id: recipeId,
          recipeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRecipes: recipe._id } }
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

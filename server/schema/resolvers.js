const { User, Recipe } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('savedRecipes');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('savedRecipes');
    },
    recipes: async (parent, { username }) => {  // Changed from 'thoughts' to 'recipes'
      const params = username ? { username } : {};
      return Recipe.find(params).sort({ createdAt: -1 });
    },
    recipe: async (parent, { recipeId }) => {  // Changed from 'thought' to 'recipe'
      return Recipe.findOne({ _id: recipeId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedRecipes');
      }
      throw new AuthenticationError('You need to be logged in!');
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
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
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
      throw new AuthenticationError('You need to be logged in!');
    },
    addRecipe: async (parent, { title, description, ingredients }, context) => {  // Added title, description, and ingredients to the input
      if (context.user) {
        const recipe = await Recipe.create({
          title,
          description,
          ingredients,
          recipeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedRecipes: recipe._id } }
        );

        return recipe;
      }
      throw new AuthenticationError('You need to be logged in!');
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
      throw new AuthenticationError('You need to be logged in!');
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
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;

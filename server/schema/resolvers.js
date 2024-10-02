const {
  User,
  Recipe,
  Ingredient,
  Instruction,
  SecretRecipe,
  Comment,
} = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { Types } = require("mongoose");

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      // Fetch a user by their username and populate their saved recipes
      return User.findOne({ username }).populate("savedRecipes");
    },
    users: async () => {
      // Fetch all users and populate their secret recipes and associated ingredients and instructions
      const allUsers = await User.find()
        .populate({
          path: 'secretRecipes',
          populate: { path: 'ingredients' },
        })
        .populate({
          path: 'secretRecipes',
          populate: { path: 'instructions' },
        });
      return allUsers;
    },
    recipes: async (parent, { username }) => {
      // Fetch recipes, optionally filtered by username, sorted by creation date
      const params = username ? { username } : {};
      return Recipe.find(params).sort({ createdAt: -1 });
    },
    getSecretRecipe: async (parent, { recipeId }, context) => {
      // Fetch a secret recipe by its ID and populate ingredient, instruction, and comment details
      const recipe = await SecretRecipe.findById(recipeId)
        .populate("ingredients")
        .populate("instructions")
        .populate("comments");

      if (!recipe) {
        throw new Error("Recipe not found");
      }
      return recipe;
    },
    recipe: async (parent, { recipeId }) => {
      // Fetch a recipe by its ID and populate author, ingredients, instructions, and comments
      return Recipe.findOne({ _id: recipeId })
        .populate("authors")
        .populate("ingredients")
        .populate("instructions")
        .populate("comments");
    },
    me: async (parent, args, context) => {
      // Fetch the currently logged-in user's data
      if (context.user) {
        return User.findOne({ _id: context.user._id })
          .populate("savedRecipes")
          .populate("secretRecipes");
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    saveRecipe: async (parent, { recipeData }, context) => {
      // Save a recipe for the logged-in user
      if (context.user) {
        const { recipeId, title, image } = recipeData;

        let recipe = await Recipe.findOne({ recipeId });

        // Create the recipe if it doesn't exist
        if (!recipe) {
          recipe = await Recipe.create({ recipeId, title, image });
        }

        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedRecipes: recipe._id, recipeData } },
          { new: true, runValidators: true }
        ).populate("savedRecipes");

        return updatedUser;
      }
      throw new AuthenticationError("Not logged in");
    },

    addUser: async (parent, { username, email, password }) => {
      // Create a new user and generate a JWT token
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Log in a user by validating email and password
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addComment: async (parent, { recipeId, commentText, commentAuthor, createdAt }) => {
      // Create a new comment and associate it with a secret recipe
      const newComment = await Comment.create({ recipeId, commentText, commentAuthor, createdAt });

      const updatedRecipe = await SecretRecipe.findByIdAndUpdate(
        recipeId,
        { $push: { comments: newComment._id } },
        { new: true, runValidators: true }
      ).populate('comments');

      if (!updatedRecipe) {
        throw new Error('Secret recipe not found.');
      }

      return newComment;
    },

    addSecretRecipe: async (parent, { secretRecipeData }, context) => {
      // Add a new secret recipe for the logged-in user
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      try {
        // Validate secretRecipeData fields
        if (!secretRecipeData.title || !secretRecipeData.ingredients || !secretRecipeData.instructions) {
          throw new Error("Title, ingredients, and instructions are required.");
        }

        // Create ingredients and store their IDs
        const ingredientIds = await Promise.all(
          secretRecipeData.ingredients.map(async (ingredient) => {
            const { name, unit, quantity } = ingredient;
            if (!name || !unit || quantity === undefined) {
              throw new Error("All ingredient fields must be provided.");
            }
            const newIngredient = await Ingredient.create({
              name,
              unit,
              quantity,
            });
            return newIngredient._id;
          })
        );

        // Create instructions and store their IDs
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

        // Create the secret recipe with ingredient and instruction IDs
        const recipe = await SecretRecipe.create({
          title: secretRecipeData.title,
          author: context.user.username,
          ingredients: ingredientIds,
          instructions: instructionIds,
          image: secretRecipeData.image,
        });

        // Update the user's secret recipes
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
      // Create a new ingredient
      const newIngredient = await Ingredient.create({ name, unit, quantity });
      return newIngredient;
    },
    addInstruction: async (_, { step, text }) => {
      // Create a new instruction
      const newInstruction = await Instruction.create({ text, step });
      return newInstruction;
    },
    removeSecretRecipe: async (parent, { recipeId }, context) => {
      // Remove a secret recipe if the user is the author
      if (context.user) {
        const recipe = await SecretRecipe.findOneAndDelete({
          _id: recipeId,
          recipeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { secretRecipes: recipeId } }
        );

        return recipe;
      }
      throw new AuthenticationError("Not logged in");
    },

    removeRecipe: async (parent, { recipeId }, context) => {
      // Remove a saved recipe if the user is the author
      if (context.user) {
        const recipe = await Recipe.findOneAndDelete({
          _id: recipeId,
          recipeAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRecipes: recipeId } }
        );

        return recipe;
      }
      throw new AuthenticationError("Not logged in");
    },

    removeComment: async (parent, { recipeId, commentId }, context) => {
      // Remove a comment if the user is the author
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
      throw new AuthenticationError("Not logged in");
    },
    removeIngredient: async (parent, { ingredientId }) => {
      // Remove an ingredient by its ID
      return Ingredient.findOneAndDelete({ _id: ingredientId });
    },
    removeInstruction: async (parent, { instructionId }) => {
      // Remove an instruction by its ID
      return Instruction.findOneAndDelete({ _id: instructionId });
    },
    updateIngredient: async (parent, { ingredientId, name, unit, quantity }) => {
      // Update an ingredient by its ID
      return Ingredient.findOneAndUpdate(
        { _id: ingredientId },
        { name, unit, quantity },
        { new: true }
      );
    },
    updateInstruction: async (parent, { instructionId, text, step }) => {
      // Update an instruction by its ID
      return Instruction.findOneAndUpdate(
        { _id: instructionId },
        { text, step },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;

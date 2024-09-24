const db = require('../config/connection');
const { User, Recipe, Ingredient, Instruction } = require('../models');
const userSeeds = require('./userSeeds.json');
const recipeSeeds = require('./recipeSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean the Recipe and User collections
    await cleanDB('Recipe', 'recipes');
    await cleanDB('User', 'users');

    // Seed users
    const users = await User.create(userSeeds);

    // Seed recipes
    for (let recipeData of recipeSeeds) {
      // Create ingredients for the recipe and save their ObjectIds
      const ingredientIds = await Promise.all(recipeData.ingredients.map(async ingredientData => {
        const ingredient = await Ingredient.create(ingredientData);
        return ingredient._id;
      }));
      const instructionIds = await Promise.all(recipeData.instructions.map(async instructionData => {
        const instruction = await Instruction.create(instructionData);
        return instruction._id;
      }));

      // Create the recipe with the ingredients and other data
      const recipe = await Recipe.create({
        ...recipeData,
        ingredients: ingredientIds,
        instructions: instructionIds,
      });

      // Find the corresponding user by recipeAuthor
      const user = await User.findOneAndUpdate(
        { username: recipeData.authors },
        { $addToSet: { recipes: recipe._id } },
        { new: true }
      );
    }

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
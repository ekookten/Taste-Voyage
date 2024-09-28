const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const recipeSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    required: false
  },
  recipeId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
  ],
  instructions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Instruction',
    },
  ]
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;

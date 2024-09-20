const { Schema } = require('mongoose');

// const { Ingredient } = require('./Ingredient');

const recipeSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  recipeId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  ingredients: [  // Change from singular to plural to support multiple ingredients
    {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
  ],
});

module.exports = recipeSchema;

const { Schema, model } = require('mongoose');

const recipeSchema = new Schema({
  authors: [
    {
      type: String,
    },
  ],
  summary: {
    type: String,
    required: true,
  },
  recipeId: {
    type: String,
    required: true,
    unique: true,
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
  ingredients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
  ],
  instructions: [
    {
      type: String,
    },
  ],
  comments: [
    {
      commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      commentAuthor: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => timestamp.toLocaleString(),
      },
    },
  ],
});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;

const { Schema, model } = require('mongoose');

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: 'N/A',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Ingredient = model('Ingredient', IngredientSchema);

module.exports = Ingredient;

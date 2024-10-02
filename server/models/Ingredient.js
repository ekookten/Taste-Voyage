const { Schema, model } = require('mongoose');

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    default: 'N/A',
  },
  quantity: {
    type: String,
    required: true,
  },
});

const Ingredient = model('Ingredient', IngredientSchema);

module.exports = Ingredient;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
  },
  quantity: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Ingredient', IngredientSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  // Optional: You can keep the `recipe` reference or drop it, depending on how tightly you want to link them.
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);

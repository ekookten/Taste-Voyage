const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const secretRecipeSchema = new Schema({
    authors: [
        {
            type: String,
        },
    ],
    image: {
        type: String,
        required: false
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
    ],
    comments: [
        {
     type: Schema.Types.ObjectId,
     ref: 'Comment',
        },
    ],
});

const SecretRecipe = model('SecretRecipe', secretRecipeSchema);

module.exports = SecretRecipe;

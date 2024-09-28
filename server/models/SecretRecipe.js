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
                get: (timestamp) => dateFormat(timestamp),
            },
        },
    ],
});

const SecretRecipe = model('SecretRecipe', secretRecipeSchema);

module.exports = SecretRecipe;

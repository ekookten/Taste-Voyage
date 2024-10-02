const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const recipeSchema = require('./Recipe');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: [/^(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'],
    },
    savedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
    secretRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SecretRecipe',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual field to get the count of saved recipes
userSchema.virtual('recipeCount').get(function () {
  return this.savedRecipes.length;
});

const User = model('User', userSchema);

module.exports = User;

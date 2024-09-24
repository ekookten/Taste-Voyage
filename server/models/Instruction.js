const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructionSchema = new Schema({
  step: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Instruction', InstructionSchema);

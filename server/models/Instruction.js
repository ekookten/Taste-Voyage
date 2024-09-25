const { Schema, model } = require('mongoose');


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


const Instruction = model('Instruction', InstructionSchema);

module.exports = Instruction;

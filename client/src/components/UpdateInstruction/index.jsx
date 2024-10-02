import React, { useState } from 'react'; 
import { UPDATE_INSTRUCTION } from '../../utils/mutations'; 
import { useMutation } from '@apollo/client'; 

function UpdateInstruction({ instruction, instructions, setInstructions, index }) {
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION); 
  const [newInstruction, setNewInstruction] = useState(instruction.text); 
  const [showForm, setShowForm] = useState(false); 

  const handleUpdateInstruction = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const stepNumber = index + 1; 
      await updateInstruction({
        variables: {
          instructionId: instruction._id, 
          text: newInstruction.trim(), 
          step: stepNumber.toString(), 
        },
      });

      const updatedInstructions = instructions.map((i) => 
        i._id === instruction._id 
          ? { ...i, text: newInstruction } 
          : i
      );
      
      setInstructions(updatedInstructions); 
      setShowForm(false); 
    } catch (err) {
      console.error(err); 
    }
  };

  const handleShowInstructionInput = () => {
    setShowForm(true);
  };

  return (
    <>
      {showForm ? (
        <form onSubmit={handleUpdateInstruction}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-fullwidth"
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)} 
                placeholder="New Instruction"
                required
              />
            </div>
            <div className="control">
              <button
                type="submit" 
                className="button is-small is-link"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="is-flex is-justify-content-space-between align-items-center">
          <p style={{
            marginBottom: '0',
            paddingLeft: '10px',
            width: '100%',
          }}>
            Step {instruction.step}: {instruction.text}
          </p>
          <button
            type="button"
            className="button is-small is-link ml-2"
            onClick={handleShowInstructionInput}
          >
            Edit
          </button>
        </div>
      )}
    </>
  );
}

export default UpdateInstruction;

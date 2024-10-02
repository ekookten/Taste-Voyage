import React, { useState } from "react";
import { UPDATE_INSTRUCTION } from "../../utils/mutations";
import { useMutation } from "@apollo/client";

function UpdateInstruction({
  instruction,
  instructions,
  setInstructions,
  index,
}) {
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION);

  const [newInstruction, setNewInstruction] = useState(instruction.text);
  const [showForm, setShowForm] = useState(false);

  const handleUpdateInstruction = async (e) => {
    e.preventDefault();
    try {
      const stepNumber = index + 1;
      await updateInstruction({
        variables: {
          instructionId: instruction._id,
          text: newInstruction.trim(),
          step: stepNumber.toString(),
        },
      });

      const updatedInstructions = instructions.map((i) => {
        if (i._id === instruction._id) {
          i.text = newInstruction;
        }
        return i;
      });
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
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="New Instruction"
            />
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-small is-link"
              onClick={handleUpdateInstruction}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
            <p style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0',
              width: '100%',
              paddingLeft: '10px',
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
          
        </>
      )}
    </>
  );
}

export default UpdateInstruction;

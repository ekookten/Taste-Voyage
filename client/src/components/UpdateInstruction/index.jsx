import React, { useState } from "react"; // Importing React and useState hook
import { UPDATE_INSTRUCTION, DELETE_INSTRUCTION } from "../../utils/mutations"; // Importing GraphQL mutations for updating and deleting instructions
import { useMutation } from "@apollo/client"; // Importing useMutation from Apollo Client

function UpdateInstruction({
  instruction,
  instructions,
  setInstructions,
  index,
}) {
  const [updateInstruction] = useMutation(UPDATE_INSTRUCTION); // Hook to execute the update mutation
  const [deleteInstruction] = useMutation(DELETE_INSTRUCTION); // Hook to execute the delete mutation

  const [newInstruction, setNewInstruction] = useState(instruction.text); // Local state for the new instruction text
  const [showForm, setShowForm] = useState(false); // State to toggle the visibility of the update form

  // Function to handle the instruction update
  const handleUpdateInstruction = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const stepNumber = index + 1; // Calculate the step number
      await updateInstruction({
        variables: {
          instructionId: instruction._id, // ID of the instruction to update
          text: newInstruction.trim(), // New instruction text
          step: stepNumber.toString(), // Step number as string
        },
      });

      // Update the local state with the new instruction details
      const updatedInstructions = instructions.map((i) => {
        if (i._id === instruction._id) {
          return { ...i, text: newInstruction }; // Update the instruction text
        }
        return i;
      });
      setInstructions(updatedInstructions); // Update the instructions state
      setShowForm(false); // Hide the form after saving
    } catch (err) {
      console.error(err); // Log any errors
    }
  };

  // Function to handle instruction deletion
  const handleDeleteInstruction = async () => {
    try {
      await deleteInstruction({
        variables: { instructionId: instruction._id }, // ID of the instruction to delete
      });

      // Update local state to remove the deleted instruction
      const updatedInstructions = instructions.filter(i => i._id !== instruction._id);
      setInstructions(updatedInstructions); // Update the instructions state
    } catch (err) {
      console.error(err); // Log any errors
    }
  };

  // Function to show the instruction input form
  const handleShowInstructionInput = () => {
    setShowForm(true);
  };

  return (
    <div className="box">
      {showForm ? (
        <form onSubmit={handleUpdateInstruction}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-fullwidth"
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)} // Update state on input change
                placeholder="New Instruction"
                required
              />
            </div>
            <div className="control">
              <button
                type="submit" // Use submit type to allow form submission with Enter key
                className="button is-small is-link"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="is-flex is-justify-content-space-between align-items-center">
          <p className="is-marginless">
            Step {instruction.step}: {instruction.text} {/* Display current instruction */}
          </p>
          <div>
            <button
              type="button"
              className="button is-small is-link ml-2"
              onClick={handleShowInstructionInput} // Show the edit form on button click
            >
              Edit
            </button>
            <button
              type="button"
              className="button is-small is-danger ml-2"
              onClick={handleDeleteInstruction} // Delete instruction
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateInstruction;

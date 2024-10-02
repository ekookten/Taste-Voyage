import React, { useState } from 'react'; 
import { UPDATE_INSTRUCTION } from '../../utils/mutations'; 
import { useMutation } from '@apollo/client'; 

function UpdateInstruction({ instruction, instructions, setInstructions, index }) {
    const [updateInstruction] = useMutation(UPDATE_INSTRUCTION); 
    const [newInstruction, setNewInstruction] = useState(instruction.text); 
    const [showForm, setShowForm] = useState(false); 

    const handleUpdateInstruction = async (e) => {
        e.preventDefault();
        
        try {
            const stepNumber = index + 1; 
            const response = await updateInstruction({
                variables: {
                    instructionId: instruction._id, 
                    text: newInstruction.trim(), 
                    step: stepNumber.toString(), 
                },
            });

            if (response.data.updateInstruction) {
                const updatedInstructions = instructions.map((i) => 
                    i._id === instruction._id 
                        ? { ...i, text: newInstruction } 
                        : i
                );
                
                setInstructions(updatedInstructions); 
                setShowForm(false); 
            } else {
                throw new Error("Instruction update failed");
            }
        } catch (err) {
            console.error("Error updating instruction:", err);
            alert("Failed to update instruction. Please try again.");
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
                                style={{ marginLeft: '10px' }} 
                                onClick={(handleUpdateInstruction)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="is-flex is-justify-content-space-between align-items-center" style={{ flexWrap: 'wrap' }}>
                    <p style={{
                        marginBottom: '0',
                        paddingLeft: '10px',
                        width: '100%',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
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

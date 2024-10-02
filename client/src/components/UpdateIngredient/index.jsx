import React, { useState } from 'react'; // Importing React and useState hook
import { UPDATE_INGREDIENT } from '../../utils/mutations'; // Importing the GraphQL mutation for updating ingredients
import { useMutation } from '@apollo/client'; // Importing useMutation from Apollo Client

function UpdateIngredient({ ingredient, ingredients, setIngredients }) {
    const [updateIngredient] = useMutation(UPDATE_INGREDIENT); // Hook to execute the update mutation

    // Local state for the ingredient's details
    const [newIngredientName, setNewIngredientName] = useState(ingredient.name);
    const [newIngredientUnit, setNewIngredientUnit] = useState(ingredient.unit);
    const [newIngredientQuantity, setNewIngredientQuantity] = useState(ingredient.quantity);
    const [showForm, setShowForm] = useState(false); // State to toggle the visibility of the update form

    // Function to handle ingredient updates
    const handleUpdateIngredient = async (e) => {
        e.preventDefault();
        try {
            await updateIngredient({
                variables: {
                    ingredientId: ingredient._id,
                    name: newIngredientName.trim(),
                    unit: newIngredientUnit.trim(),
                    quantity: parseFloat(newIngredientQuantity.trim()), // Ensure quantity is a number
                }
            });

            // Update the local state with the new ingredient details
            const updatedIngredients = ingredients.map(i => {
                if (i._id === ingredient._id) {
                    return {
                        ...i,
                        name: newIngredientName,
                        unit: newIngredientUnit,
                        quantity: newIngredientQuantity,
                    };
                }
                return i;
            });

            setIngredients(updatedIngredients); // Update the ingredients state
            setShowForm(false); // Hide the form after saving
        } catch (err) {
            console.error(err); // Log any errors
        }
    };

    // Function to show the ingredient input form
    const handleShowIngredientInput = () => {
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
                            value={newIngredientName}
                            onChange={(e) => setNewIngredientName(e.target.value)}
                            placeholder="Name"
                        />
                    </div>
                    <div className="control is-expanded">
                        <input
                            className="input"
                            type="text"
                            value={newIngredientQuantity}
                            onChange={(e) => setNewIngredientQuantity(e.target.value)}
                            placeholder="Quantity"
                        />
                    </div>
                    <div className="control is-expanded">
                        <input
                            className="input"
                            type="text"
                            value={newIngredientUnit}
                            onChange={(e) => setNewIngredientUnit(e.target.value)}
                            placeholder="Unit"
                        />
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            className="button is-small is-link"
                            onClick={handleUpdateIngredient}
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
                        {ingredient.name}, {ingredient.quantity} {ingredient.unit}
                    </p>
                    <button type="button"
                        className="button is-small is-link ml-2"
                        onClick={handleShowIngredientInput}>Edit
                    </button>
                </>
            )}
        </>
    );
}

export default UpdateIngredient;

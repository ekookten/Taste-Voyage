import React, { useState } from 'react'; 
import { UPDATE_INGREDIENT } from '../../utils/mutations'; 
import { useMutation } from '@apollo/client'; 

function UpdateIngredient({ ingredient, ingredients, setIngredients }) {
    const [updateIngredient] = useMutation(UPDATE_INGREDIENT); 
    const [newIngredientName, setNewIngredientName] = useState(ingredient.name);
    const [newIngredientUnit, setNewIngredientUnit] = useState(ingredient.unit);
    const [newIngredientQuantity, setNewIngredientQuantity] = useState(ingredient.quantity);
    const [showForm, setShowForm] = useState(false); 

    const handleUpdateIngredient = async (e) => {
        e.preventDefault(); 

        try {
            const response = await updateIngredient({
                variables: {
                    ingredientId: ingredient._id,
                    name: newIngredientName.trim(),
                    unit: newIngredientUnit.trim(),
                    quantity: parseFloat(newIngredientQuantity), 
                }
            });

            if (response.data.updateIngredient) {
                const updatedIngredients = ingredients.map(i => 
                    i._id === ingredient._id 
                        ? { ...i, name: newIngredientName, unit: newIngredientUnit, quantity: parseFloat(newIngredientQuantity) } 
                        : i
                );

                setIngredients(updatedIngredients); 
                setShowForm(false); 
            } else {
                throw new Error("Ingredient update failed");
            }
        } catch (err) {
            console.error("Error updating ingredient:", err);
            alert("Failed to update ingredient. Please try again.");
        }
    };

    const handleShowIngredientInput = () => {
        setShowForm(true);
    };

    return (
        <>
            {showForm ? (
                <form onSubmit={handleUpdateIngredient}>
                    <div className="field is-grouped is-grouped-multiline">
                        <div className="control is-expanded">
                            <input
                                className="input is-fullwidth"
                                type="text"
                                value={newIngredientName}
                                onChange={(e) => setNewIngredientName(e.target.value)}
                                placeholder="Name"
                                required
                            />
                        </div>
                        <div className="control is-expanded">
                            <input
                                className="input is-fullwidth"
                                type="number"
                                value={newIngredientQuantity}
                                onChange={(e) => setNewIngredientQuantity(e.target.value)}
                                placeholder="Quantity"
                                required
                            />
                        </div>
                        <div className="control is-expanded">
                            <input
                                className="input is-fullwidth"
                                type="text"
                                value={newIngredientUnit}
                                onChange={(e) => setNewIngredientUnit(e.target.value)}
                                placeholder="Unit"
                                required
                            />
                        </div>
                        <div className="control">
                            <button
                                type="submit"
                                className="button is-small is-link is-fullwidth"
                                onClick={(handleUpdateIngredient)}
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
                        wordBreak: 'break-word', // This will wrap long words
                        overflowWrap: 'break-word', // Ensure it wraps correctly
                    }}>
                        {ingredient.name}, {ingredient.quantity} {ingredient.unit}
                    </p>
                    <button type="button"
                        className="button is-small is-link ml-2"
                        onClick={handleShowIngredientInput}
                    >
                        Edit
                    </button>
                </div>
            )}
        </>
    );
}

export default UpdateIngredient;

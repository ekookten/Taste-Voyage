import React, { useState } from 'react'; 
import { UPDATE_INGREDIENT, DELETE_INGREDIENT } from '../../utils/mutations'; 
import { useMutation } from '@apollo/client'; 

function UpdateIngredient({ ingredient, ingredients, setIngredients }) {
    const [updateIngredient] = useMutation(UPDATE_INGREDIENT); 
    const [deleteIngredient] = useMutation(DELETE_INGREDIENT); // Hook for deleting ingredients
    const [newIngredientName, setNewIngredientName] = useState(ingredient.name);
    const [newIngredientUnit, setNewIngredientUnit] = useState(ingredient.unit);
    const [newIngredientQuantity, setNewIngredientQuantity] = useState(ingredient.quantity);
    const [showForm, setShowForm] = useState(false); 

    const handleUpdateIngredient = async (e) => {
        e.preventDefault();
        try {
            await updateIngredient({
                variables: {
                    ingredientId: ingredient._id,
                    name: newIngredientName.trim(),
                    unit: newIngredientUnit.trim(),
                    quantity: parseFloat(newIngredientQuantity.trim()), 
                }
            });

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

            setIngredients(updatedIngredients); 
            setShowForm(false); 
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteIngredient = async () => {
        try {
            await deleteIngredient({
                variables: { ingredientId: ingredient._id }, // ID of the ingredient to delete
            });

            const updatedIngredients = ingredients.filter(i => i._id !== ingredient._id);
            setIngredients(updatedIngredients); // Update the ingredients state
        } catch (err) {
            console.error(err); // Log any errors
        }
    };

    const handleShowIngredientInput = () => {
        setShowForm(true);
    };

    return (
        <div className="box">
            {showForm ? (
                <form onSubmit={handleUpdateIngredient}>
                    <div className="field has-addons">
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
                        {ingredient.name}, {ingredient.quantity} {ingredient.unit}
                    </p>
                    <div>
                        <button type="button"
                            className="button is-small is-link ml-2"
                            onClick={handleShowIngredientInput}
                        >
                            Edit
                        </button>
                        <button type="button"
                            className="button is-small is-danger ml-2"
                            onClick={handleDeleteIngredient} // Call delete function on click
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateIngredient;

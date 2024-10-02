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
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
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
                        onClick={handleShowIngredientInput}
                    >
                        Edit
                    </button>
                </>
            )}
        </>
    );
}

export default UpdateIngredient;

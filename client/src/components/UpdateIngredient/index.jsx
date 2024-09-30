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
                    i.name = newIngredientName;
                    i.unit = newIngredientUnit;
                    i.quantity = newIngredientQuantity;
                }
                return i;
            });
            setIngredients(updatedIngredients);
            setShowForm(false);
        } catch (err) {
            console.error(err);
    };
};
    const handleShowIngredientInput = () => {
        setShowForm(true);
    };

    const handleAddIngredient = () => {
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
                            className="button is-link"
                            onClick={handleUpdateIngredient}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <>
                <p>{ingredient.name}, {ingredient.quantity} {ingredient.unit}</p>
                <button type="button"
                    className="button is-link"
                    onClick={handleShowIngredientInput}>Edit
                </button>
                </>
            )}



        </>
    )
}

export default UpdateIngredient;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_RECIPE, ADD_INGREDIENT, ADD_INSTRUCTION } from '../../utils/mutations'; // Import the ADD_INSTRUCTION mutation
import Auth from '../../utils/auth';
import decode from 'jwt-decode';

const AddRecipe = () => {
    const navigate = useNavigate();
    const [addRecipe] = useMutation(ADD_RECIPE);
    const [addIngredient] = useMutation(ADD_INGREDIENT);
    const [addInstruction] = useMutation(ADD_INSTRUCTION); // Mutation for adding instructions

    const loggedIn = Auth.loggedIn();
    let username = '';

    if (loggedIn) {
        const token = Auth.getToken();
        const decodedToken = decode(token);
        username = decodedToken.username || decodedToken.data?.username || '';
    } else {
        navigate('/login');
    }

    const [title, setTitle] = useState('');
    const [author] = useState(username);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredientName, setNewIngredientName] = useState('');
    const [newIngredientUnit, setNewIngredientUnit] = useState('');
    const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
    const [showIngredientInput, setShowIngredientInput] = useState(false);
    const [instructions, setInstructions] = useState([]);
    const [newInstruction, setNewInstruction] = useState('');
    const [showInstructionInput, setShowInstructionInput] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddIngredient = async () => {
        if (
            newIngredientName.trim() !== '' &&
            newIngredientUnit.trim() !== '' &&
            newIngredientQuantity.trim() !== ''
        ) {
            console.log('Adding Ingredient:', {
                name: newIngredientName,
                unit: newIngredientUnit,
                quantity: parseFloat(newIngredientQuantity),
            });

            try {
                const { data } = await addIngredient({ 
                    variables: { 
                        name: newIngredientName.trim(), 
                        unit: newIngredientUnit.trim(), 
                        quantity: parseFloat(newIngredientQuantity.trim()) 
                    } 
                });

                if (data && data.addIngredient) {
                    setIngredients([...ingredients, data.addIngredient]);
                } else {
                    console.error("Unexpected response:", data);
                }

                // Reset input fields
                setNewIngredientName('');
                setNewIngredientUnit('');
                setNewIngredientQuantity('');
                setShowIngredientInput(false);
            } catch (error) {
                console.error("Error adding ingredient:", error);
            }
        }
    };

    const handleShowIngredientInput = () => {
        setShowIngredientInput(true);
    };

    const handleAddInstruction = async () => {
        if (newInstruction.trim() !== '') {
            const stepNumber = instructions.length + 1; 
            try {
                const { data } = await addInstruction({
                    variables: {
                        text: newInstruction.trim(),
                        step: stepNumber.toString(),
                    },
                });
                
                if (data && data.addInstruction) {
                    setInstructions([...instructions, data.addInstruction]);
                } else {
                    console.error("Unexpected response:", data);
                }

                setNewInstruction('');
                setShowInstructionInput(false);
            } catch (error) {
                console.error("Error adding instruction:", error);
            }
        }
    };

    const handleShowInstructionInput = () => {
        setShowInstructionInput(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (ingredients.length === 0) {
            alert("Please add at least one ingredient.");
            return;
        }
    
        try {
            const recipeData = {
                title,
                author,
                ingredients: ingredients.map((ingredient) => ({
                    name: ingredient.name,  // Assuming this is a string
                    unit: ingredient.unit,   // Assuming this is a string
                    quantity: ingredient.quantity.toString(), // Convert quantity to string
                })),
                instructions: instructions.map((instruction) => ({
                    step: instruction.step.toString(), // Convert step to string if necessary
                    text: instruction.text, // Assuming this is a string
                })),
                image,
                recipeId: Math.floor(Math.random() * 1000), 
            };
    
            const { data } = await addRecipe({
                variables: { recipeData },
            });
    
            // Clear the form after submission
            setTitle('');
            setIngredients([]);
            setNewIngredientName('');
            setNewIngredientUnit('');
            setNewIngredientQuantity('');
            setInstructions([]);
            setNewInstruction('');
            setImage(null);
    
            alert("Your Secret Recipe has been added!");
            navigate('/me');
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="title is-3 has-text-centered">Add a New Recipe</h1>
            <form onSubmit={handleSubmit} className="box">
                <div className="field">
                    <label className="label">Title:</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Ingredients:</label>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.name}, {ingredient.unit}, {ingredient.quantity}</li>
                        ))}
                    </ul>
                    {!showIngredientInput ? (
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-link" 
                                onClick={handleShowIngredientInput}
                            >
                                Add Ingredient
                            </button>
                        </div>
                    ) : (
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
                                    onClick={handleAddIngredient}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">Instructions:</label>
                    <ul>
                        {instructions.map((instruction, index) => (
                            <li key={index}>Step {instruction.step}: {instruction.text}</li>
                        ))}
                    </ul>
                    {!showInstructionInput ? (
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-link" 
                                onClick={handleShowInstructionInput}
                            >
                                Add Instruction
                            </button>
                        </div>
                    ) : (
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
                                    className="button is-link" 
                                    onClick={handleAddInstruction}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">Image:</label>
                    <div className="control">
                        <input 
                            className="input" 
                            type="file" 
                            onChange={handleImageChange} 
                            accept="image/*" 
                        />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button className="button is-primary is-fullwidth" type="submit">Add Recipe</button>
                    </div>
                </div>
                <div className="author-info">
                    <h2 className="subtitle is-4 has-text-centered">Creator: {author}</h2>
                </div>
            </form>
        </div>
    );
};

export default AddRecipe;

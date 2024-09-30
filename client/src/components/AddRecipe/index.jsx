import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_SECRET_RECIPE, ADD_INGREDIENT, ADD_INSTRUCTION, REMOVE_INGREDIENT, REMOVE_INSTRUCTION, UPDATE_INGREDIENT, UPDATE_INSTRUCTION } from '../../utils/mutations'; // Import the ADD_INSTRUCTION mutation
import Auth from '../../utils/auth';
import decode from 'jwt-decode';
import UpdateIngredient from '../UpdateIngredient';


const AddRecipe = () => {
    const navigate = useNavigate();
    const [addSecretRecipe] = useMutation(ADD_SECRET_RECIPE);
    const [addIngredient] = useMutation(ADD_INGREDIENT);
    const [addInstruction] = useMutation(ADD_INSTRUCTION); 
    const [removeIngredient] = useMutation(REMOVE_INGREDIENT);
    const [removeInstruction] = useMutation(REMOVE_INSTRUCTION);
    
    const [updateInstruction] = useMutation(UPDATE_INSTRUCTION);// Mutation for adding instructions

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
            newIngredientName.trim() !== '' &&  // Ensure the name is not empty
            newIngredientUnit.trim() !== '' &&
            newIngredientQuantity.trim() !== ''
        ) {
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
                }
    
                // Reset input fields
                setNewIngredientName('');
                setNewIngredientUnit('');
                setNewIngredientQuantity('');
                setShowIngredientInput(false);
            } catch (error) {
                console.error("Error adding ingredient:", error);
            }
        } else {
            alert("Ingredient name, unit, and quantity are required.");
        }
    };

    const handleShowIngredientInput = () => {
        setShowIngredientInput(true);
    };

    const handleAddInstruction = async () => {
        if (newInstruction.trim() !== '') {  // Ensure the instruction text is not empty
            try {
                const stepNumber = instructions.length + 1;
                const { data } = await addInstruction({
                    variables: {
                        text: newInstruction.trim(),
                        step: stepNumber.toString(),
                    },
                });
    
                if (data && data.addInstruction) {
                    setInstructions([...instructions, data.addInstruction]);
                }
    
                setNewInstruction('');
                setShowInstructionInput(false);
            } catch (error) {
                console.error("Error adding instruction:", error);
            }
        } else {
            alert("Instruction text cannot be empty.");
        }
    };

    const handleShowInstructionInput = () => {
        setShowInstructionInput(true);
    };

    const handleRemoveIngredient = async (e) => {
        const ingredientId = e.target.parentElement.getAttribute('data-id');
        try {
            await removeIngredient({ variables: { ingredientId } });
            setIngredients(ingredients.filter((ingredient) => ingredient._id !== ingredientId));
        } catch (error) {
            console.error("Error removing ingredient:", error);
        }
    };

    const handleRemoveInstruction = async (e) => {
        const instructionId = e.target.parentElement.getAttribute('data-id');
        try {
            await removeInstruction({ variables: { instructionId } });
            setInstructions(instructions.filter((instruction) => instruction._id !== instructionId));
        } catch (error) {
            console.error("Error removing instruction:", error);
        }
    };

    const handleUpdateIngredient = async (e) => {
    };
    const handleUpdateInstruction = async (e) => {
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (ingredients.length === 0) {
            alert("Please add at least one ingredient.");
            return;
        }
    
        try {
            // Set a default image if none is provided
            const defaultImage = 'https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg';
            const recipeImage = image || defaultImage;
    
            const secretRecipeData = {
                title,
                ingredients: ingredients.map((ingredient) => ({
                    name: ingredient.name,
                    unit: ingredient.unit,
                    quantity: ingredient.quantity.toString(),
                })),
                instructions: instructions.map((instruction) => ({
                    step: instruction.step.toString(),
                    text: instruction.text,
                })),
                image: recipeImage,
            };
    
            // Add the secret recipe (make sure your mutation handles the ID)
            await addSecretRecipe({
                variables: { secretRecipeData },
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
            navigate(`/me`);
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };
    

    return (
        <div className="container box has-background-light" style={{ width: '50%', margin: '0 auto' }}>
            <h1 className="title is-3 has-text-centered box has-background-light has-text-black">Add Your Secret Recipe</h1>
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
                            <li key={index} data-id={ingredient._id}> 
                        <UpdateIngredient ingredient={ingredient} ingredients={ingredients} setIngredients={setIngredients}/>
                        {<button type="button" 
                                    className="button is-link"
                                    onClick={handleRemoveIngredient}>Remove</button>}
                        </li>
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
                            <li key={index} data-id={instruction._id}>Step {instruction.step}: {instruction.text}
                            <button type="button" 
                                    className="button is-link" 
                                    onClick={handleUpdateInstruction}>Edit</button>
                            <button type="button" 
                                    className="button is-link" 
                                    onClick={handleRemoveInstruction}>Remove</button>
                            </li>
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
    
                <div className="field has-text-centered">
                    <div className="control" >
                        <button className="button is-primary" style={{ width: '40%', margin: '0 auto' }} type="submit">Add Recipe</button>
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

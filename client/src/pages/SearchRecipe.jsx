import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client'; // Import useMutation from Apollo Client
import { ADD_RECIPE } from '../utils/mutations'; // Import your ADD_RECIPE mutation
import Auth from '../utils/auth'; // Import the Auth utility
import decode from 'jwt-decode';

const AddRecipe = () => {
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [addRecipe] = useMutation(ADD_RECIPE); // Use the ADD_RECIPE mutation

    // Check if user is logged in and get username
    const loggedIn = Auth.loggedIn();
    let username = '';

    if (loggedIn) {
        const token = Auth.getToken();
        const decodedToken = decode(token);
        username = decodedToken.username || decodedToken.data?.username || '';
    } else {
        navigate('/login'); // Redirect to login page if not logged in
    }

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(username);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [showIngredientInput, setShowIngredientInput] = useState(false);
    const [instructions, setInstructions] = useState([]);
    const [newInstruction, setNewInstruction] = useState('');
    const [showInstructionInput, setShowInstructionInput] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleAddIngredient = () => {
        if (newIngredient.trim() !== '') {
            setIngredients([...ingredients, newIngredient]);
            setNewIngredient('');
            setShowIngredientInput(false);
        }
    };

    const handleShowIngredientInput = () => {
        setShowIngredientInput(true);
    };

    const handleAddInstruction = () => {
        if (newInstruction.trim() !== '') {
            setInstructions([...instructions, newInstruction]);
            setNewInstruction('');
            setShowInstructionInput(false);
        }
    };

    const handleShowInstructionInput = () => {
        setShowInstructionInput(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Call the mutation to save the recipe
            const { data } = await addRecipe({
                variables: { 
                    title, 
                    author, 
                    ingredients, 
                    instructions, 
                    image 
                },
            });

            // Clear the form after submission
            setTitle('');
            setIngredients([]);
            setNewIngredient('');
            setInstructions([]);
            setNewInstruction('');
            setImage(null);
    
            // Optionally navigate to a different page or show a success message
            navigate('/some-route'); // Change this to the route you want to redirect to after saving
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
                            <li key={index}>{ingredient}</li>
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
                                    value={newIngredient} 
                                    onChange={(e) => setNewIngredient(e.target.value)} 
                                    placeholder="New Ingredient"
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
                            <li key={index}>Step {index + 1}: {instruction}</li>
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

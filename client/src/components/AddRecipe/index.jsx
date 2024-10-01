import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
    ADD_SECRET_RECIPE,
    ADD_INGREDIENT,
    ADD_INSTRUCTION,
    REMOVE_INGREDIENT,
    REMOVE_INSTRUCTION,
} from "../../utils/mutations";
import Auth from "../../utils/auth";
import decode from "jwt-decode";
import UpdateIngredient from "../UpdateIngredient";
import UpdateInstruction from "../UpdateInstruction";

const AddRecipe = () => {
    const navigate = useNavigate();
    const [addSecretRecipe] = useMutation(ADD_SECRET_RECIPE);
    const [addIngredient] = useMutation(ADD_INGREDIENT);
    const [addInstruction] = useMutation(ADD_INSTRUCTION);
    const [removeIngredient] = useMutation(REMOVE_INGREDIENT);
    const [removeInstruction] = useMutation(REMOVE_INSTRUCTION);

    const loggedIn = Auth.loggedIn();
    let username = "";

    if (loggedIn) {
        const token = Auth.getToken();
        const decodedToken = decode(token);
        username = decodedToken.username || decodedToken.data?.username || "";
    } else {
        navigate("/login");
    }

    const [title, setTitle] = useState("");
    const [author] = useState(username);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientUnit, setNewIngredientUnit] = useState("");
    const [newIngredientQuantity, setNewIngredientQuantity] = useState("");
    const [showIngredientInput, setShowIngredientInput] = useState(false);
    const [instructions, setInstructions] = useState([]);
    const [newInstruction, setNewInstruction] = useState("");
    const [showInstructionInput, setShowInstructionInput] = useState(false);
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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
        if (newIngredientName.trim() && newIngredientUnit.trim() && newIngredientQuantity.trim()) {
            try {
                const capitalizedIngredientName = newIngredientName.charAt(0).toUpperCase() + newIngredientName.slice(1);

                const { data } = await addIngredient({
                    variables: {
                        name: capitalizedIngredientName,
                        unit: newIngredientUnit.trim(),
                        quantity: parseFloat(newIngredientQuantity.trim()),
                    },
                });

                if (data && data.addIngredient) {
                    setIngredients([...ingredients, data.addIngredient]);
                }

                setNewIngredientName("");
                setNewIngredientUnit("");
                setNewIngredientQuantity("");
                setShowIngredientInput(false);
            } catch (error) {
                console.error("Error adding ingredient:", error);
            }
        } else {
            alert("Ingredient name, unit, and quantity are required.");
        }
    };

    const handleAddInstruction = async () => {
        if (newInstruction.trim()) {
            try {
                const capitalizedInstruction = newInstruction.charAt(0).toUpperCase() + newInstruction.slice(1);
                const stepNumber = instructions.length + 1;

                const { data } = await addInstruction({
                    variables: {
                        text: capitalizedInstruction,
                        step: stepNumber.toString(),
                    },
                });

                if (data && data.addInstruction) {
                    setInstructions([...instructions, data.addInstruction]);
                }

                setNewInstruction("");
                setShowInstructionInput(false);
            } catch (error) {
                console.error("Error adding instruction:", error);
            }
        } else {
            alert("Instruction text cannot be empty.");
        }
    };

    const handleRemoveIngredient = async (e) => {
        const ingredientId = e.target.parentElement.getAttribute("data-id");
        try {
            await removeIngredient({ variables: { ingredientId } });
            setIngredients(ingredients.filter((ingredient) => ingredient._id !== ingredientId));
        } catch (error) {
            console.error("Error removing ingredient:", error);
        }
    };

    const handleRemoveInstruction = async (e) => {
        const instructionId = e.target.parentElement.getAttribute("data-id");
        try {
            await removeInstruction({ variables: { instructionId } });
            setInstructions(instructions.filter((instruction) => instruction._id !== instructionId));
        } catch (error) {
            console.error("Error removing instruction:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ingredients.length === 0 || instructions.length === 0) {
            alert("Please complete the form.");
            return;
        }

        try {
            const defaultImage = "https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg";
            const recipeImage = image || defaultImage;
            const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

            const secretRecipeData = {
                title: capitalizedTitle,
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

            await addSecretRecipe({ variables: { secretRecipeData } });

            setTitle("");
            setIngredients([]);
            setNewIngredientName("");
            setNewIngredientUnit("");
            setNewIngredientQuantity("");
            setInstructions([]);
            setNewInstruction("");
            setImage(null);

            // Show success modal
            setModalMessage("Your Secret Recipe was created successfully!");
            setIsModalOpen(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                setIsModalOpen(false);
                navigate(`/me`);
            }, 1000);
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    return (
        <div className="container box has-background-light" style={{ width: "50%", margin: "0 auto" }}>
            {isModalOpen && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
                    <div className="modal-content">
                        <div className="box has-text-centered">
                            <h2 className="title">{modalMessage}</h2>
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={() => setIsModalOpen(false)}></button>
                </div>
            )}
            <h1 className="title is-3 has-text-centered box has-background-light has-text-black">
                Add Your Secret Recipe
            </h1>
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
                    <ol>
                        {ingredients.map((ingredient, index) => (
                            <li key={index} data-id={ingredient._id} className="has-border is-flex is-align-items-center" style={{ border: '0.5px solid white', borderRadius: '4px', padding: '5px', height: '40px', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                    <UpdateIngredient
                                        ingredient={ingredient}
                                        ingredients={ingredients}
                                        setIngredients={setIngredients}
                                    />
                                </div>
                                <button type="button" className="button is-small is-link ml-2" onClick={handleRemoveIngredient}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ol>
                    {!showIngredientInput ? (
                        <div className="control">
                            <button type="button" className="button is-link" onClick={() => setShowIngredientInput(true)}>
                                Add Ingredient
                            </button>
                        </div>
                    ) : (
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input className="input" type="text" value={newIngredientName} onChange={(e) => setNewIngredientName(e.target.value)} placeholder="Name" />
                            </div>

                            <div className="control is-expanded">
                                <input className="input" type="text" value={newIngredientQuantity} onChange={(e) => setNewIngredientQuantity(e.target.value)} placeholder="Quantity" />
                            </div>

                            <div className="control is-expanded">
                                <input className="input" type="text" value={newIngredientUnit} onChange={(e) => setNewIngredientUnit(e.target.value)} placeholder="Unit" />
                            </div>

                            <div className="control">
                                <button type="button" className="button is-link" onClick={handleAddIngredient}>
                                    Submit
                                </button>
                                <button type="button" className="button is-text" onClick={() => setShowIngredientInput(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">Instructions:</label>
                    <ol>
                        {instructions.map((instruction, index) => (
                            <li key={index} data-id={instruction._id} className="has-border is-flex is-align-items-center" style={{ border: '0.5px solid white', borderRadius: '4px', padding: '5px', height: '40px', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                    <UpdateInstruction
                                        instruction={instruction}
                                        instructions={instructions}
                                        setInstructions={setInstructions}
                                    />
                                </div>
                                <button type="button" className="button is-small is-link ml-2" onClick={handleRemoveInstruction}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ol>
                    {!showInstructionInput ? (
                        <div className="control">
                            <button type="button" className="button is-link" onClick={() => setShowInstructionInput(true)}>
                                Add Instruction
                            </button>
                        </div>
                    ) : (
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input className="input" type="text" value={newInstruction} onChange={(e) => setNewInstruction(e.target.value)} placeholder="Instruction" />
                            </div>

                            <div className="control">
                                <button type="button" className="button is-link" onClick={handleAddInstruction}>
                                    Submit
                                </button>
                                <button type="button" className="button is-text" onClick={() => setShowInstructionInput(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="field">
                    <label className="label">Image:</label>
                    <div className="control">
                        <input className="input" type="file" onChange={handleImageChange} />
                    </div>
                </div>

                <div className="field has-text-centered">
                    <div className="control">
                        <button className="button is-primary" style={{ width: "40%", margin: "0 auto" }} type="submit">
                            Add Recipe
                        </button>
                    </div>
                </div>

                <div className="author-info">
                    <h2 className="subtitle has-text-centered">
                        <strong className="is-6">Creator:</strong> {author}
                    </h2>
                </div>
            </form>
        </div>
    );
};

export default AddRecipe;
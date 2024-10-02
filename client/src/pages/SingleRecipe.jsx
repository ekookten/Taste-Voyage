import { searchSpoonacularById, searchSpoonacularInstructions } from "../utils/API";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const SingleRecipe = () => {
  const { recipeId } = useParams(); // Extract recipeId from URL parameters
  const [recipe, setRecipe] = useState(null); // State to store recipe details
  const [instructions, setInstructions] = useState([]); // State to store recipe instructions
  const [ingredients, setIngredients] = useState([]); // State to store recipe instructions
  useEffect(() => {
    // Fetch recipe details and instructions when the component mounts
    const fetchRecipeDetails = async () => {
      try {
        // Fetch the recipe details by ID
        const recipeData = await searchSpoonacularById(recipeId);

        // Fetch the recipe instructions by ID
        const instructionsData  = await searchSpoonacularInstructions(recipeId);

        // Update the state with fetched data
      
       
        setRecipe(recipeData);
        setInstructions(instructionsData[0].steps || []);
        setIngredients(recipeData.extendedIngredients || []);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]); // Dependency array includes recipeId to re-run on ID change

  if (!recipe) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="container mt-5">
      {/* Display the recipe title */}
      <div className="box has-background-light" style={{ borderRadius: '8px', padding: '10px', marginBottom: '20px' }}>
        <h1 className="title is-2 has-text-centered has-text-black">{recipe.title || "No Title Available"}</h1>
      </div>
  
      {/* Display the recipe image */}
      {recipe.image && (
        <div className="card" style={{ display: 'flex', justifyContent: 'center', border: 'none', boxShadow: 'none' }}>
          <div className="card-image" style={{ border: 'none', boxShadow: 'none' }}>
            <figure className="image" style={{ width: '350px', height: 'auto', margin: '0', border: 'none' }}>
              <img 
                src={recipe.image} 
                alt={`The cover of ${recipe.title}`} 
                style={{ width: '100%', height: 'auto', border: 'none', boxShadow: 'none', borderRadius: '8px' }} 
              />
            </figure>
          </div>
        </div>
      )}
  
      {/* Ingredients Section */}
      <div className="box mt-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
        <h2 className="title is-4 has-text-black">Ingredients</h2>
        <ul>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <li className="has-text-black" key={index}>
                <strong className="has-text-black">{ingredient.name}</strong>: {ingredient.amount} {ingredient.unit}
              </li>
            ))
          ) : (
            <li className="has-text-black">No ingredients available for this recipe.</li>
          )}
        </ul>
      </div>
  
      {/* Instructions Section */}
      <div className="box mt-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
        <h2 className="title is-4 has-text-black">Instructions</h2>
        <ol>
          {instructions.length > 0 ? (
            instructions.map((step, index) => (
              <li className="has-text-black" key={index}>Step {index + 1}: {step.step}</li>
            ))
          ) : (
            <li className="has-text-black">No instructions available for this recipe.</li>
          )}
        </ol>
      </div>
    </div>
  );
  
  
};

export default SingleRecipe;

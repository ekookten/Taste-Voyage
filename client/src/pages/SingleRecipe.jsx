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
      console.log(recipeData)
        console.log(instructionsData[0].steps);
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
    <div>
        {/* Display the recipe title */}
        <h1 className="title is-4" >{recipe.title || "No Title Available"}</h1>

        {/* Display the recipe image */}
        {recipe.image && (
            <img src={recipe.image} alt={`The cover of ${recipe.title}`} />
        )}




<div className="content">
<h2 className="title is-4">Ingredients</h2>
    <ul>
        {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}: {ingredient.amount} {ingredient.unit}</li>
            ))
        ) : (
            <li>No ingredients available for this recipe.</li>
        )}
    </ul>
</div>


<div className="content">
<h2 className="title is-4">Instructions</h2>
{/* List the instructions steps */
<ol className="content">
    {instructions.length > 0 ? (
        instructions.map((step, index) => (
            <li key={index}>Step {index + 1}: {step.step}</li>
        ))
    ) : (
        <li>No instructions available for this recipe.</li>
    )}
</ol>}
</div>
      
   
    </div>
);
};

export default SingleRecipe;

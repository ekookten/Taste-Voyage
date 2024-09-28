import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SECRET_RECIPE } from '../utils/queries';

const SingleSecretRecipe = () => {
  const { recipeId } = useParams(); // Extract recipeId from URL parameters
  
  // Use Apollo's useQuery hook to fetch the recipe details
  const { loading, error, data } = useQuery(GET_SECRET_RECIPE, {
    variables: { recipeId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const recipe = data?.getSecretRecipe; // Directly fetch the populated recipe

  if (!recipe) return <p>No recipe found.</p>;

  return (
    <div>
      <h1 className="title is-4">{recipe.title || 'No Title Available'}</h1>

      {recipe.image && (
        <img
        src={recipe.image}
          alt={`The cover of ${recipe.title}`}
          style={{ width: '200px', height: '200px' }}
        />
      )}

      <div className="content">
        <h2 className="title is-4">Ingredients</h2>
        <ul>
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}: {ingredient.quantity} {ingredient.unit}
              </li>
            ))
          ) : (
            <li>No ingredients available for this recipe.</li>
          )}
        </ul>
      </div>

      <div className="content">
        <h2 className="title is-4">Instructions</h2>
        <ol className="content">
          {recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, index) => (
              <li key={index}>
                Step {step.step}: {step.text}
              </li>
            ))
          ) : (
            <li>No instructions available for this recipe.</li>
          )}
        </ol>
      </div>
    </div>
  );
};

export default SingleSecretRecipe;

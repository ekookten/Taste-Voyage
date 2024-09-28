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
    <div className="container mt-5">
      {/* Display the recipe title */}
      <div className="box has-background-light" style={{ borderRadius: '8px', padding: '5px', marginBottom: '20px' }}>
        <h1 className="title is-2 has-text-centered">{recipe.title || 'No Title Available'}</h1>
      </div>
  
      {/* Display the recipe image */}
      {recipe.image && (
        <div className="card" style={{ display: 'flex', justifyContent: 'center', border: 'none', boxShadow: 'none' }}>
          <div className="card-image" style={{ border: 'none', boxShadow: 'none' }}>
            <figure className="image"style={{ width: '350px', height: 'auto', margin: '0', border: 'none' }}>
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
        <h2 className="title is-4">Ingredients</h2>
        <ul>
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <strong>{ingredient.name}</strong>: {ingredient.quantity} {ingredient.unit}
              </li>
            ))
          ) : (
            <li>No ingredients available for this recipe.</li>
          )}
        </ul>
      </div>
  
      {/* Instructions Section */}
      <div className="box mt-5" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
        <h2 className="title is-4">Instructions</h2>
        <ol>
          {recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, index) => (
              <li key={index}>
                <strong>Step {step.step}:</strong> {step.text}
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

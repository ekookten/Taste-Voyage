import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_RECIPE, REMOVE_SECRET_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";
import { Link } from "react-router-dom"; // Import Link for navigation

const Profile = () => {
  const { data, loading, error } = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me?.savedRecipes || data?.me?.secretRecipes) {
        setSavedRecipes(data.me.savedRecipes);
        setSecretRecipes(data.me.secretRecipes);
      }
    },
  });
  
  const [removeRecipe] = useMutation(REMOVE_RECIPE);
  const [removeSecretRecipe] = useMutation(REMOVE_SECRET_RECIPE);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [secretRecipes, setSecretRecipes] = useState([]);
  const userData = data?.me || {};

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await removeRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }]
      });
      console.log(recipeId)
      setSavedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      console.log("Recipe removed successfully");
    } catch (err) {
      console.error("Error removing recipe:", err);
    }
  };

  const handleDeleteSecretRecipe = async (recipeId) => {
    try {
      await removeSecretRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }]
      });
      console.log(recipeId)
      setSecretRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      console.log("Recipe removed successfully");
    } catch (err) {
      console.error("Error removing recipe:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{Auth.loggedIn() ? `${userData.username}'s saved recipes` : 'Log in to see saved recipes'}</h2>
      {savedRecipes.length > 0 && (
        <div className="recipe-grid">
          {savedRecipes.map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-image" />}
              <h3>{recipe.title}</h3>
              {recipe.description && <p>{recipe.description}</p>}
              <Link to={`/recipe/${recipe.recipeId}`} className="button is-primary">View Details</Link>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe._id); }}>Remove This Recipe</button>
            </div>
          ))}
        </div>
      )}{secretRecipes.length > 0 && (
        <div className="recipe-grid">
          {secretRecipes.map((recipe) => (
                    <div className="recipe-card" key={recipe._id}>
                      <img 
                      src={recipe.image || 'https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg'} 
                      alt={recipe.title} 
                      className="recipe-image" 
                      style={{ width: '150px', height: '150px' }}
                      />
                      <h3>{recipe.title}</h3>
                      {recipe.description && <p>{recipe.description}</p>}
                      <Link to={`/secret/${recipe.recipeId}`} className="button is-primary">View Details</Link>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteSecretRecipe(recipe._id); }}>Remove This Recipe</button>
            </div>
          ))}
        </div>
      )}
      {/* Add Recipe Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/add-recipe" className="button is-success">Create Your Secret Recipe</Link>
      </div>
    </div>
  );
};

export default Profile;

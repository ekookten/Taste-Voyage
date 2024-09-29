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
    <div className="container">
      <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
        {Auth.loggedIn() ? `${userData.username}'s Saved Recipes` : 'Log in to see saved recipes'}
      </h2>
  
      {savedRecipes.length > 0 ? (
        <div className="columns is-multiline">
          {savedRecipes.map((recipe) => (
            <div className="column is-one-third" key={recipe._id}>
              <div className="card" style={{ maxWidth: '300px', margin: '0 auto' }}>
                {recipe.image && (
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={recipe.image} alt={recipe.title} />
                    </figure>
                  </div>
                )}
                <div className="card-content">
                  <h3 className="title is-5">{recipe.title}</h3>
                  {recipe.description && <p className="subtitle is-6">{recipe.description}</p>}
                  <div className="buttons">
                    <Link to={`/recipe/${recipe.recipeId}`} className="button is-primary">View Details</Link>
                    <button
                      className="button is-danger"
                      onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe._id); }}
                    >
                      Remove This Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notification is-warning has-text-centered" style={{ maxWidth: '300px', margin: '0 auto' }}>
          You Don't Have Any Saved Recipes.
        </div>
      )}

      <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
        {Auth.loggedIn() ? `${userData.username}'s Secret Recipes` : 'Log in to see saved recipes'}
      </h2>
      
      {secretRecipes.length > 0 ? (
        <div className="columns is-multiline">
          {secretRecipes.map((recipe) => (
            <div className="column is-one-third" key={recipe._id}>
              <div className="card" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img 
                      src={recipe.image || 'https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg'} 
                      alt={recipe.title} 
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <h3 className="title is-5">{recipe.title}</h3>
                  {recipe.description && <p className="subtitle is-6">{recipe.description}</p>}
                  <div className="buttons">
                    <Link to={`/secret/${recipe._id}`} className="button is-primary">View Details</Link>
                    <button
                      className="button is-danger"
                      onClick={(e) => { e.stopPropagation(); handleDeleteSecretRecipe(recipe._id); }}
                    >
                      Remove This Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notification is-warning has-text-centered" style={{ maxWidth: '300px', margin: '0 auto' }}>
        You Don't Have Any Secret Recipes.
      </div>
      )}
  
      {/* Add Recipe Button */}
      <div className="has-text-centered" style={{ marginTop: '20px' }}>
        <Link to="/add-recipe" className="button is-success">Create Your Secret Recipe</Link>
      </div>
    </div>
  );
};

export default Profile;

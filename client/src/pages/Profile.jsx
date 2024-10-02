import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client"; // Import Apollo hooks for querying and mutating
import { GET_ME } from "../utils/queries"; // Import query to get user data
import { REMOVE_RECIPE, REMOVE_SECRET_RECIPE } from "../utils/mutations"; // Import mutations for removing recipes
import Auth from "../utils/auth"; // Import authentication utility
import { Link } from "react-router-dom"; // Import Link for navigation

const Profile = () => {
  // Fetch user data using the GET_ME query with authorization header
  const { data, loading, error } = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`, // Include token for authentication
      },
    },
    fetchPolicy: 'network-only', // Always fetch from the server
    onCompleted: (data) => {
      // Set saved and secret recipes once data is fetched
      if (data?.me?.savedRecipes || data?.me?.secretRecipes) {
        setSavedRecipes(data.me.savedRecipes);
        setSecretRecipes(data.me.secretRecipes);
      }
    },
  });
  
  const [removeRecipe] = useMutation(REMOVE_RECIPE); // Mutation to remove saved recipe
  const [removeSecretRecipe] = useMutation(REMOVE_SECRET_RECIPE); // Mutation to remove secret recipe
  const [savedRecipes, setSavedRecipes] = useState([]); // State to store saved recipes
  const [secretRecipes, setSecretRecipes] = useState([]); // State to store secret recipes
  const userData = data?.me || {}; // Extract user data from query result

  // Function to handle deleting a saved recipe
  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Call removeRecipe mutation with recipeId
      await removeRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }] // Refetch user data after deletion
      });
      
      // Update state to remove deleted recipe from UI
      setSavedRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      console.log("Recipe removed successfully");
    } catch (err) {
      console.error("Error removing recipe:", err); // Log any errors
    }
  };

  // Function to handle deleting a secret recipe
  const handleDeleteSecretRecipe = async (recipeId) => {
    try {
      // Call removeSecretRecipe mutation with recipeId
      await removeSecretRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }] // Refetch user data after deletion
      });
      
      // Update state to remove deleted secret recipe from UI
      setSecretRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      console.log("Recipe removed successfully");
    } catch (err) {
      console.error("Error removing recipe:", err); // Log any errors
    }
  };

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Loading state handling
  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  // Error handling
  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if an error occurs
  }

  return (
    <div className="container">
      {/* Header for saved recipes */}
      <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
        {Auth.loggedIn() ? `${capitalizeFirstLetter(userData.username)}'s Saved Recipes` : 'Log in to see saved recipes'}
      </h2>
  
      {/* Check if user has saved recipes */}
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
                      onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe._id); }} // Prevent click event bubbling
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

      {/* Header for secret recipes */}
      <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
        {Auth.loggedIn() ? `${capitalizeFirstLetter(userData.username)}'s Secret Recipes` : 'Log in to see saved recipes'}
      </h2>
      
      {/* Check if user has secret recipes */}
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
                      onClick={(e) => { e.stopPropagation(); handleDeleteSecretRecipe(recipe._id); }} // Prevent click event bubbling
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

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";

const Profile = () => {
  // Fetch user data with saved recipes
  const { data, loading, error } = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    },
  });
  const [removeRecipe] = useMutation(REMOVE_RECIPE);

  // Initialize state for managing saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Extract user data
  const userData = data?.me || {};

  // Update the state when data is loaded
  useEffect(() => {
    if (userData?.savedRecipes) {
      setSavedRecipes(userData.savedRecipes);
    }
  }, [userData]);

  // Function to handle recipe removal
  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Call the removeRecipe mutation
      await removeRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }]
      });

      // Update the state after deletion
      setSavedRecipes((prevRecipes) =>
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
    
    return (
        <div>
            <h2>{Auth.loggedIn() ? `${userData.username}'s saved recipes` : 'Log in to see saved recipes'}</h2>
            <div className="recipe-grid">
                {userData.savedRecipes?.map((recipe) => (
                    <div className="recipe-card" key={recipe._id}>
                        {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-image" />}
                        <h3>{recipe.title}</h3>
                        {/* <p>{recipe.ingredients.join(', ')}</p> */}
                        {recipe.description && <p>{recipe.description}</p>}
                        <button onClick={() => handleDeleteRecipe(recipe._id)}>Remove This Recipe</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
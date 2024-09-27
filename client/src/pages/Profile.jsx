import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_RECIPE } from "../utils/mutations";
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
      if (data?.me?.savedRecipes) {
        setSavedRecipes(data.me.savedRecipes);
      }
    },
  });

  const [removeRecipe] = useMutation(REMOVE_RECIPE);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userData = data?.me || {};

  useEffect(() => {
    if (userData?.savedRecipes) {
      setSavedRecipes(userData.savedRecipes);
    }
  }, [userData]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await removeRecipe({
        variables: { recipeId },
        refetchQueries: [{ query: GET_ME }]
      });
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
            {recipe.description && <p>{recipe.description}</p>}
            <Link to={`/recipe/${recipe.recipeId}`} className="button is-primary">View Details</Link>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe._id); }}>Remove This Recipe</button>
          </div>
        ))}
      </div>

      {/* Add Recipe Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/add-recipe" className="button is-success">Create Your Secret Recipe</Link>
      </div>
    </div>
  );
};

export default Profile;

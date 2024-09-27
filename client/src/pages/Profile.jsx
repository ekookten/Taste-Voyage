import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_RECIPE } from '../utils/mutations';
import Auth from '../utils/auth';

const Profile = () => {
    const { loading, data } = useQuery(GET_ME);
    const [removeRecipe] = useMutation(REMOVE_RECIPE);

    const userData = data?.me || {};

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await removeRecipe({
                variables: { recipeId },
                update: (cache, { data: { removeRecipe } }) => {
                    const { me } = cache.readQuery({ query: GET_ME });
                    cache.writeQuery({
                        query: GET_ME,
                        data: { me: { ...me, savedRecipes: removeRecipe.savedRecipes } },
                        
                    });
                    console.log(userData.savedRecipes);
                },
            });
            console.log('Recipe removed successfully');
        } catch (err) {
            console.error(err);
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
                        <button onClick={() => handleDeleteRecipe(recipe.recipeId)}>Remove This Recipe</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client"; 
import { SAVE_RECIPE } from "../utils/mutations"; 
import { GET_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { searchSpoonacular } from "../utils/API";

const SearchRecipes = (props) => {
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [noResultsModal, setNoResultsModal] = useState(false); // State for modal visibility

  const [saveRecipe] = useMutation(SAVE_RECIPE); 
  const { loading, data } = useQuery(GET_ME); 

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
   
    setSavedRecipeIds(data?.me.savedRecipes.map((recipe) => recipe.recipeId) || []);
    
    try {
      const response = await searchSpoonacular(searchInput);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const { results } = await response.json();

      const recipeInput = results.map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title || "No Title Available",
        image: recipe.image,
      }));

      setSearchedRecipes(recipeInput);
      setSearchInput("");

      // Show modal if no results are found
      if (recipeInput.length === 0) {
        setNoResultsModal(true);
      } else {
        setNoResultsModal(false);
      }
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    const recipeToSave = searchedRecipes.find(
      (recipe) => recipe.recipeId === recipeId
    );

    if (!recipeToSave) {
      console.error('Recipe not found for the given recipeId');
      return;
    }

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveRecipe({
        variables: { 
          recipeData: {
            title: recipeToSave.title,
            image: recipeToSave.image,
            recipeId: recipeToSave.recipeId,
          }
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (data) {
        setSavedRecipeIds([...savedRecipeIds, recipeToSave.recipeId]);
      }
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="has-background-dark has-text-light p-5">
        <div className="container">
          <h1 className="title has-text-light has-text-centered">Search for Recipes!</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="columns is-vcentered">
              <div className="column is-8">
                <div className="control">
                  <input
                    className="input is-large"
                    name="searchInput"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                    placeholder="Search for a recipe"
                  />
                </div>
              </div>
              <div className="column is-4">
                <button
                  type="submit"
                  className="button is-success is-large is-fullwidth"
                >
                  Submit Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <div className="container">
        <h2 className="title pt-5 has-text-centered">
          {searchedRecipes.length
            ? `Viewing ${searchedRecipes.length} results:`
            : "Search for a recipe to begin"}
        </h2>
        <div className="columns is-multiline is-centered">
          {searchedRecipes.map((recipe) => {
            return (
              <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile" key={recipe.recipeId}>
                <div className="card" style={{ maxWidth: '250px', margin: '0 auto' }}>
                  {recipe.image && (
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img
                          src={recipe.image} 
                          alt={`The cover for ${recipe.title}`}
                        />
                      </figure>
                    </div>
                  )}
                  <div className="card-content">
                    <p className="title is-6">{recipe.title}</p> 
                    {Auth.loggedIn() && (
                      <button
                        disabled={savedRecipeIds?.some(
                          (savedRecipeId) => savedRecipeId === recipe.recipeId
                        )}
                        className="button is-info is-fullwidth"
                        onClick={() => handleSaveRecipe(recipe.recipeId)}
                      >
                        {savedRecipeIds?.some(
                          (savedRecipeId) => savedRecipeId === recipe.recipeId
                        )
                          ? <span className="is-size-7">This recipe has already been saved!</span>
                          : "Save this Recipe!"}
                      </button>
                    )}
                    <Link
                      to={`/recipe/${recipe.recipeId}`}
                      className="button is-primary is-fullwidth mt-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for no results */}
      {noResultsModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setNoResultsModal(false)}></div>
          <div className="modal-content">
            <div className="box has-text-centered">
              <h2 className="title">No Results Found</h2>
              <p>Sorry, there are no results for "{searchInput}"</p>
              <button className="button is-primary" onClick={() => setNoResultsModal(false)}>Close</button>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setNoResultsModal(false)}></button>
        </div>
      )}
    </>
  );
};

export default SearchRecipes;

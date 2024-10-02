import React from "react"; // Importing React
import { GET_USERS } from "../../utils/queries"; // Importing the GraphQL query to get users
import { useQuery } from "@apollo/client"; // Importing the useQuery hook from Apollo Client
import { Link } from "react-router-dom"; // Importing Link for navigation between routes

const SecretRecipes = () => {
  // Use the GET_USERS query to fetch users from the server
  const { loading, data } = useQuery(GET_USERS);
  const users = data?.users || []; // Extracting users from the response or default to an empty array

  // Display a loading message while the query is in progress
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="title has-text-centered mt-2">Secret Recipes</h1>
      {users.map((user) => (
        // Only render users with secret recipes
        user.secretRecipes.length > 0 && (
          <div key={user._id}>
            <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
              {/* Capitalize the first letter of the username */}
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </h2>
            <div className="columns is-multiline mt-2 mb-2">
              {user.secretRecipes.map((recipe) => (
                <div className="column is-one-third" key={recipe._id}>
                  <div className="card" style={{ maxWidth: '300px', margin: '0 auto' }}>
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img
                          // Display the recipe image or a default image if none is provided
                          src={recipe.image || "https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg"}
                          alt={recipe.title}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <h3 className="title is-5">
                        {/* Capitalize the first letter of the recipe title */}
                        {recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}
                      </h3>
                      {/* Render the recipe description if it exists */}
                      {recipe.description && <p className="subtitle is-6">{recipe.description}</p>}
                      <div className="buttons">
                        {/* Link to the recipe details page */}
                        <Link to={`/secret/${recipe._id}`} className="button is-primary">View Details</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {/* Display a message if no users have secret recipes */}
      {users.length === 0 && (
        <div className="notification is-warning has-text-centered" style={{ maxWidth: '300px', margin: '0 auto' }}>
          No users found with secret recipes.
        </div>
      )}
    </div>
  );
};

export default SecretRecipes;

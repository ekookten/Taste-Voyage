import React from "react";
import { GET_USERS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const SecretRecipes = () => {
  const { loading, data } = useQuery(GET_USERS);
  const users = data?.users || [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="title has-text-centered">Secret Recipes</h1>
      {users.map((user) => (
        user.secretRecipes.length > 0 && (
          <div key={user._id}>
            <h2 className="title has-text-centered is-size-4 box has-background-light has-text-black">
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </h2>
            <div className="columns is-multiline">
              {user.secretRecipes.map((recipe) => (
                <div className="column is-one-third" key={recipe._id}>
                  <div className="card" style={{ maxWidth: '300px', margin: '0 auto' }}>
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img
                          src={recipe.image || "https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg"}
                          alt={recipe.title}
                        />
                      </figure>
                    </div>
                    <div className="card-content">
                      <h3 className="title is-5">{recipe.title.charAt(0).toUpperCase() + recipe.title.slice(1)}</h3>
                      {recipe.description && <p className="subtitle is-6">{recipe.description}</p>}
                      <div className="buttons">
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
      {users.length === 0 && (
        <div className="notification is-warning has-text-centered" style={{ maxWidth: '300px', margin: '0 auto' }}>
          No users found with secret recipes.
        </div>
      )}
    </div>
  );
};

export default SecretRecipes;

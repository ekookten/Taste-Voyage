import React, { useEffect, useState } from "react";
import { GET_USERS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const SecretRecipes = () => {
  const { loading, data } = useQuery(GET_USERS);
  const users = data?.users || [];

  return (
    <div>
      <h1>Secret Recipes</h1>
      {users.map((user) => (
        <>
          {user.secretRecipes.length !== 0 ? (
            <div key={user._id}>
              <h2>{user.username}</h2>
              <ul>
                {user.secretRecipes.map((recipe) => (
                  <div className="column is-one-third" key={recipe._id}>
                    <div
                      className="card"
                      style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img
                            src={
                              recipe.image ||
                              "https://static.vecteezy.com/system/resources/previews/005/292/398/non_2x/cute-sushi-roll-character-confused-free-vector.jpg"
                            }
                            alt={recipe.title}
                          />
                        </figure>
                      </div>
                      <div className="card-content">
                        <h3 className="title is-5">{recipe.title}</h3>
                        {recipe.description && (
                          <p className="subtitle is-6">{recipe.description}</p>
                        )}
                        <div className="buttons">
                          <Link
                            to={`/secret/${recipe._id}`}
                            className="button is-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ))}
    </div>
  );
};

export default SecretRecipes;

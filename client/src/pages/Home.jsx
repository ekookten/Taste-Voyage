import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css'; // Import Bulma CSS

function Home() {
  // const [recipes, setRecipes] = useState([]);
  // // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch('/api/recipes')
  //     .then(res => res.json())
  //     .then(data => {
  //       setRecipes(data);
  //       // setLoading(false);
  //     });
  // }, []);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}> {/* White background with padding */}
      <h1 className="title has-text-centered has-text-black">Welcome to Taste Voyage!</h1>

      <div className="columns is-centered is-flex is-align-items-stretch">
        {/* Info Box 1 */}
        <div className="column is-4">
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            <h2 className="title has-background-primary has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Search For Recipes
            </h2>
            <p className="has-background-white has-text-black has-text-centered is-flex-grow-1" style={{ padding: '1rem', margin: '0', height: '75%' }}>
              Find a variety of recipes from different cuisines and dietary preferences.
            </p>
          </div>
        </div>

        {/* Info Box 2 */}
        <div className="column is-4">
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            <h2 className="title has-background-warning has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Create Your Own Recipes
            </h2>
            <p className="has-background-white has-text-black has-text-centered is-flex-grow-1" style={{ padding: '1rem', margin: '0', height: '75%' }}>
              Share your unique recipes with the community by uploading them to our platform.
            </p>
          </div>
        </div>

        {/* Info Box 3 */}
        <div className="column is-4">
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            <h2 className="title has-background-danger has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Save Your Favorite Recipes
            </h2>
            <p className="has-background-white has-text-black has-text-centered is-flex-grow-1" style={{ padding: '1rem', margin: '0', height: '75%' }}>
              Save and organize your favorite recipes for easy access anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

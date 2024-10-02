import React from 'react';
import 'bulma/css/bulma.min.css'; // Import Bulma CSS for styling

function Home() {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}> {/* Set a white background with full height and padding */}
      {/* Main title centered on the page */}
      <h1 className="title has-text-centered has-text-black">Welcome to Taste Voyage!</h1>

      <div className="columns is-centered is-mobile is-multiline"> {/* Centered columns that are responsive and allow multiline wrapping */}
        
        {/* Info Box 1 */}
        <div className="column is-12-mobile is-4-tablet is-4-desktop"> {/* Responsive column that takes full width on mobile, and 1/3 width on tablet/desktop */}
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            {/* Title of the box with primary background color */}
            <h2 className="title has-background-primary has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Search For Recipes
            </h2>
            {/* Description of the feature */}
            <p className="has-background-white has-text-black has-text-centered is-flex-grow-1" style={{ padding: '1rem', margin: '0', height: '75%' }}>
              Find a variety of recipes from different cuisines and dietary preferences.
            </p>
          </div>
        </div>

        {/* Info Box 2 */}
        <div className="column is-12-mobile is-4-tablet is-4-desktop"> {/* Responsive column layout */}
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            {/* Title of the box with warning background color */}
            <h2 className="title has-background-warning has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Create Your Own Recipes
            </h2>
            {/* Description of the feature */}
            <p className="has-background-white has-text-black has-text-centered is-flex-grow-1" style={{ padding: '1rem', margin: '0', height: '75%' }}>
              Share your unique recipes with the community by uploading them to our platform.
            </p>
          </div>
        </div>

        {/* Info Box 3 */}
        <div className="column is-12-mobile is-4-tablet is-4-desktop"> {/* Responsive column layout */}
          <div className="box is-flex is-flex-direction-column" style={{ border: '0.5px solid black', height: '100%', padding: '0' }}>
            {/* Title of the box with danger background color */}
            <h2 className="title has-background-danger has-text-black has-text-centered" style={{ margin: '0', padding: '1rem', color: 'black' }}>
              Save Your Favorite Recipes
            </h2>
            {/* Description of the feature */}
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

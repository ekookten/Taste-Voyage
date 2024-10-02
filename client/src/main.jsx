import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bulma/css/bulma.min.css'; // Import Bulma CSS for styling

import App from './App'; // Main application component
import Home from './pages/Home'; // Home page component
import Signup from './pages/Signup'; // Signup page component
import Login from './pages/Login'; // Login page component
import SingleRecipe from './pages/SingleRecipe'; // Page for displaying a single recipe
import Profile from './pages/Profile'; // User profile page
import Error from './pages/Error'; // Error page component
import SearchRecipe from './pages/SearchRecipe'; // Page for searching recipes
import AddRecipe from './components/AddRecipe'; // Component for adding a new recipe
import SecretRecipes from './components/SecretRecipes'; // Component for displaying secret recipes
import SingleSecretRecipe from './pages/SingleSecretRecipe'; // Page for displaying a single secret recipe

// Create a browser router with defined routes
const router = createBrowserRouter([
  {
    path: "/", // Root path for the application
    element: <App />, // Main application component that wraps other routes
    errorElement: <Error />, // Component to display if there's an error
    children: [ // Nested routes under the main App component
      {
        index: true, // Default route that loads at the root path
        element: <Home /> // Load the Home component
      },
      {
        path: '/login', // Route for the login page
        element: <Login />
      },
      {
        path: '/signup', // Route for the signup page
        element: <Signup />
      },
      {
        path: '/search', // Route for the search recipes page
        element: <SearchRecipe />
      }, 
      {
        path: '/secret-recipes', // Route for displaying secret recipes
        element: <SecretRecipes />
      }, 
      {
        path: '/secret/:recipeId', // Dynamic route for a single secret recipe
        element: <SingleSecretRecipe />
      }, 
      {
        path: 'add-recipe', // Route for adding a new recipe
        element: <AddRecipe />
      },
      {
        path: '/me', // Route for the user's profile
        element: <Profile />
      },
      {
        path: '/recipe/:recipeId', // Dynamic route for a single recipe
        element: <SingleRecipe />
      }
    ]
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} /> // Provide the router to the application
);

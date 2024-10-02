import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bulma/css/bulma.min.css';

import App from './App';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SingleRecipe from './pages/SingleRecipe';
import Profile from './pages/Profile';
import Error from './pages/Error';
import SearchRecipe from './pages/SearchRecipe';
import AddRecipe from './components/AddRecipe';
import SecretRecipes from './components/SecretRecipes';
import SingleSecretRecipe from './pages/SingleSecretRecipe';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/search',
        element: <SearchRecipe />
      }, 
      {
        path: '/secret-recipes',
        element: <SecretRecipes />
      }, 
      {
        path: '/secret/:recipeId',
        element: <SingleSecretRecipe />
      }, 
      {
        path: 'add-recipe',
        element: <AddRecipe />
      },
      {
        path: '/me',
        element: <Profile />
      },
      {
        path: '/recipe/:recipeId',
        element: <SingleRecipe />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

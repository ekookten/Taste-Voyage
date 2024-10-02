import { Link } from 'react-router-dom'; // Importing Link for navigation
import Auth from '../../utils/auth'; // Utility for authentication-related functions
import decode from 'jwt-decode'; // Importing decode for decoding JWT tokens

const AppNavbar = () => {
  const loggedIn = Auth.loggedIn(); // Check if the user is logged in
  let username = '';

  // If the user is logged in, decode the token to get the username
  if (loggedIn) {
    const token = Auth.getToken(); // Get the authentication token
    const decodedToken = decode(token); // Decode the token
    username = decodedToken.username || decodedToken.data?.username || '';  // Handle cases where username might be nested
  }

  return (
    <>
      <nav className="navbar is-dark has-shadow" style={{ padding: '1rem 2rem' }}>
        <div className="container is-fluid">
          <div className="navbar-brand">
            {/* Link to the homepage */}
            <Link className="navbar-item has-text-weight-bold is-size-4" to='/'>
              Taste Voyage
            </Link>
            {/* Hamburger menu for mobile view */}
            <div className="navbar-burger" 
                 data-target="navbarMenu" 
                 onClick={() => document.querySelector('.navbar-menu').classList.toggle('is-active')}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          {/* Navbar menu */}
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end">
              {/* Link to search for recipes */}
              <Link to='/search' className="button is-light ml-2 mb-2">Search for Recipes</Link>
              {loggedIn ? (
                // If logged in, show these links
                <>
                  <Link to={`/secret-recipes`} className="button is-light ml-2 mb-2">Secret Recipes</Link>
                  <Link to={`/me`} className="button is-light ml-2 mb-2">My Profile</Link>
                  <button onClick={() => Auth.logout()} className="button is-light ml-2 mb-2">Logout</button>
                  <span className="navbar-item ml-2 is-size-5">
                    Welcome,<strong className='has-text-light'>{username.toUpperCase()}</strong>
                  </span>
                </>
              ) : (
                // If not logged in, show these links
                <>
                  <Link to='/login' className="button is-light ml-2 mb-2">Login</Link>
                  <Link to='/signup' className="button is-primary ml-2 mb-2">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppNavbar;

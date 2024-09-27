import { Link } from 'react-router-dom';
import Signup from '../../pages/Signup'; 
import Login from '../../pages/Login';
import Auth from '../../utils/auth'; 
import decode from 'jwt-decode';
import { GET_ME } from '../../utils/queries';   

const AppNavbar = () => {
  const loggedIn = Auth.loggedIn();
  let username = '';

  if (loggedIn) {
    const token = Auth.getToken();
    const decodedToken = decode(token);
    
    console.log('Decoded token:', decodedToken);  // Log the decoded token to inspect its structure
    
    // Check if username exists in the decoded token
    username = decodedToken.username || decodedToken.data?.username || '';  // Handle cases where username might be nested
  }

  return (
    <>
      <nav className="navbar is-dark has-shadow" style={{ padding: '1rem 2rem' }}>
        <div className="container is-fluid">
          <div className="navbar-brand">
            <Link className="navbar-item has-text-weight-bold is-size-4" to='/'>
              Taste Voyage
            </Link>
            <div className="navbar-burger" data-target="navbarMenu" onClick={() => document.querySelector('.navbar-menu').classList.toggle('is-active')}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end">
              <Link to='/search' className="button is-light">Search for Recipes</Link>
              {loggedIn ? (
                <>
                  <Link to={`/profiles/${username}`} className="button is-light">My Profile</Link>
                    <button onClick={() => Auth.logout()} className="button is-light ml-2">Logout</button>
                  <span className="navbar-item">Welcome,<strong className='has-text-light'>{username.toUpperCase()}</strong></span>
                </>
              ) : (
                <>
                  <Link to='/login' className="button is-light ml-2">Login</Link>
                  <Link to='/signup' className="button is-primary ml-2">Sign Up</Link>
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

import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <>
      <nav className="navbar is-dark has-shadow" style={{ padding: '1rem 2rem' }}> {/* Padding and shadow */}
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
              {/* Search for Recipes Button */}
              <Link to='/search' className="button is-light">Search for Recipes</Link> {/* New button for search */}
              {/* Navigation Links for Login and Sign Up */}
              <Link to='/login' className="button is-light ml-2">Login</Link>
              <Link to='/signup' className="button is-primary ml-2">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppNavbar;
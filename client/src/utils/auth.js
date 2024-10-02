import decode from 'jwt-decode';

class Auth {
  /**
   * Saves the ID token to localStorage and redirects the user to the home page.
   * @param {string} idToken - The JWT token received upon successful login.
   */
  static login(idToken) {
    localStorage.setItem('id_token', idToken); // Store the token in localStorage
    window.location.assign('/'); // Redirect to the home page
  }

  /**
   * Removes the ID token from localStorage and redirects the user to the home page.
   */
  static logout() {
    localStorage.removeItem('id_token'); // Remove the token from localStorage
    window.location.assign('/'); // Redirect to the home page
  }

  /**
   * Checks if a user is logged in by verifying the existence and validity of the token.
   * @returns {boolean} - True if the user is logged in; otherwise, false.
   */
  static loggedIn() {
    const token = Auth.getToken(); // Retrieve the token
    return !!token && !Auth.isTokenExpired(token); // Check if token exists and is not expired
  }

  /**
   * Retrieves the ID token from localStorage.
   * @returns {string|null} - The stored token or null if it doesn't exist.
   */
  static getToken() {
    return localStorage.getItem('id_token'); // Get the token from localStorage
  }

  /**
   * Checks if the provided token has expired.
   * @param {string} token - The JWT token to check.
   * @returns {boolean} - True if the token has expired; otherwise, false.
   */
  static isTokenExpired(token) {
    try {
      const decoded = decode(token); // Decode the token to access its claims
      if (decoded.exp < Date.now() / 1000) {
        return true; // Token is expired
      }
      return false; // Token is valid
    } catch (err) {
      return false; // Return false if there's an error during decoding
    }
  }
}

export default Auth;

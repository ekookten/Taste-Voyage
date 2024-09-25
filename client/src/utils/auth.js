import decode from 'jwt-decode';

class Auth {
    // Save token to localStorage and log the user in
    static login(idToken) {
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
    }
  
    // Remove token from localStorage and log the user out
    static logout() {
      localStorage.removeItem('id_token');
      window.location.assign('/');
    }
  
    // Check if a user is logged in by verifying token existence
    static loggedIn() {
      const token = Auth.getToken();
      return !!token && !Auth.isTokenExpired(token);
    }
  
    // Retrieve token from localStorage
    static getToken() {
      return localStorage.getItem('id_token');
    }
  
    // Check if token has expired
    static isTokenExpired(token) {
      try {
        const decoded = decode(token); // Assuming you use jwt-decode package
        if (decoded.exp < Date.now() / 1000) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    }
  }
  
  export default Auth;
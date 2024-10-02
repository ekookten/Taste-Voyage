import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth'; // Import authentication utility
import { LOGIN_USER } from '../utils/mutations'; // Import login mutation

function Login(props) {
  // State to manage form inputs
  const [formState, setFormState] = useState({ email: '', password: '' });
  // Mutation for logging in
  const [login, { error }] = useMutation(LOGIN_USER);
  // State to manage notifications (success/error messages)
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Call the login mutation with email and password
      const { data } = await login({
        variables: { email: formState.email, password: formState.password },
      });

      // If login is successful, store the token in local storage
      Auth.login(data.login.token);
      // Set success notification
      setNotification({ message: 'Login successful!', type: 'is-success' });
    } catch (e) {
      console.error('Login error:', e); // Log any errors
      // Set error notification
      setNotification({ message: 'Login failed. Please try again.', type: 'is-danger' });
    }
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target; // Get the name and value of the input
    setFormState({
      ...formState,
      [name]: value, // Update the corresponding field in formState
    });
  };

  return (
    <section className="section"> {/* Main section for the login form */}
      <div className="container">
        <div className="columns is-centered"> {/* Center the form on the page */}
          <div className="column is-one-third"> {/* Set the width of the form */}
            <h1 className="title has-text-centered">Login</h1>

            {/* Conditional rendering of notification messages */}
            {notification.message && (
              <div className={`notification ${notification.type}`}>
                <button className="delete" onClick={() => setNotification({ message: '', type: '' })}></button>
                {notification.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit}> {/* Form submission handler */}
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="e.g. alex@example.com"
                    value={formState.email} // Controlled input for email
                    onChange={handleChange} // Update state on change
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formState.password} // Controlled input for password
                    onChange={handleChange} // Update state on change
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button className="button is-primary is-fullwidth" type="submit">Login</button> {/* Submit button */}
                </div>
              </div>

              <div className="has-text-centered">
                <p>Don't have an account? <a href="/signup">Sign up here</a></p> {/* Link to signup page */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

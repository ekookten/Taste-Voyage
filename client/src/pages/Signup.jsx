import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth'; // Import authentication utility
import { ADD_USER } from '../utils/mutations'; // Import GraphQL mutation for adding a user

function Signup() {
  // State to hold form inputs and notification messages
  const [formState, setFormState] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [addUser, { error }] = useMutation(ADD_USER); // Use mutation to add a user
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notifications

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Check for minimum username length
    if (formState.username.length < 3) {
      setNotification({ message: 'Username must be at least 3 characters long.', type: 'is-danger' });
      return; // Exit if the username is too short
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (!formState.email.includes('@')) {
      setNotification({ message: 'Please enter a valid email (e.g., example@email.com).', type: 'is-danger' });
      return;
    } else if (formState.email.endsWith('@')) {
      setNotification({ message: 'Please enter a domain (e.g., .com, .edu, .org) after "@" in your email.', type: 'is-danger' });
      return;
    } else if (!emailRegex.test(formState.email)) {
      setNotification({ message: 'Please enter a valid email (e.g., example@email.com).', type: 'is-danger' });
      return;
    }

    // Validate password length and special character
    const passwordRegex = /^(?=.*[!@#$%^&*])/; // Regex for at least one special character
    if (formState.password.length < 8 && !passwordRegex.test(formState.password)) {
      setNotification({ message: 'Password must be at least 8 characters long and contain at least one special character (!@#$%^&*).', type: 'is-danger' });
      return; // Exit if the password is too short or lacks a special character
    }
   
    // Check if password and confirm password match
    if (formState.password !== formState.confirmPassword) {
      setNotification({ message: 'Passwords do not match.', type: 'is-danger' });
      return; // Exit if passwords don't match
    }

    try {
      // Call the addUser mutation to sign up the user
      const { data } = await addUser({
        variables: { username: formState.username, email: formState.email, password: formState.password },
      });

      Auth.login(data.addUser.token); // Log the user in using the token returned
      setNotification({ message: 'Signup successful!', type: 'is-success' }); // Notify user of success
    } catch (e) {
      console.error('Signup error:', e); // Log any errors
      setNotification({ message: 'Signup failed. Please try again.', type: 'is-danger' }); // Notify user of failure
    }
  };

  // Handle changes to the input fields
  const handleChange = (event) => {
    const { name, value } = event.target; // Get the input's name and value
    setFormState({
      ...formState,
      [name]: value, // Update the specific field in formState
    });
  };

  return (
    <section className="section"> {/* Main section for the signup form */}
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title has-text-centered">Sign Up</h1>

            {/* Display notification messages if any */}
            {notification.message && (
              <div className={`notification ${notification.type}`}>
                <button className="delete" onClick={() => setNotification({ message: '', type: '' })}></button>
                {notification.message}
              </div>
            )}

            {/* Signup form */}
            <form onSubmit={handleFormSubmit}>
              {/* Username input */}
              <div className="field">
                <label className="label">Username</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formState.username}
                    onChange={handleChange} // Update username in form state
                  />
                </div>
              </div>

              {/* Email input */}
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="e.g. alex@example.com"
                    value={formState.email}
                    onChange={handleChange} // Update email in form state
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formState.password}
                    onChange={handleChange} // Update password in form state
                  />
                </div>
              </div>

              {/* Confirm password input */}
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formState.confirmPassword}
                    onChange={handleChange} // Update confirm password in form state
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="field">
                <div className="control">
                  <button className="button is-primary is-fullwidth" type="submit">Sign Up</button>
                </div>
              </div>

              {/* Link to login page if user already has an account */}
              <div className="has-text-centered">
                <p>Already have an account? <a href="/login">Log in here</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup; // Export the Signup component

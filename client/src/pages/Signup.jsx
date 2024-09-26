import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';

function Signup() {
  const [formState, setFormState] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [addUser, { error }] = useMutation(ADD_USER);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'is-danger' });
      return;
    }
    try {
      const { data } = await addUser({
        variables: { username: formState.username, email: formState.email, password: formState.password },
      });

      Auth.login(data.addUser.token);
      setNotification({ message: 'Signup successful!', type: 'is-success' });
    } catch (e) {
      console.error('Signup error:', e);
      setNotification({ message: 'Signup failed. Please try again.', type: 'is-danger' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title has-text-centered">Sign Up</h1>

            {notification.message && (
              <div className={`notification ${notification.type}`}>
                <button className="delete" onClick={() => setNotification({ message: '', type: '' })}></button>
                {notification.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="field">
                <label className="label">Username</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formState.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="e.g. alex@example.com"
                    value={formState.email}
                    onChange={handleChange}
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
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    value={formState.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button className="button is-primary is-fullwidth" type="submit">Sign Up</button>
                </div>
              </div>

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

export default Signup;
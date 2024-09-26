import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { LOGIN_USER } from '../utils/mutations';

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { email: formState.email, password: formState.password },
      });

      Auth.login(data.login.token);
      setNotification({ message: 'Login successful!', type: 'is-success' });
    } catch (e) {
      console.error('Login error:', e);
      setNotification({ message: 'Login failed. Please try again.', type: 'is-danger' });
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
            <h1 className="title has-text-centered">Login</h1>

            {notification.message && (
              <div className={`notification ${notification.type}`}>
                <button className="delete" onClick={() => setNotification({ message: '', type: '' })}></button>
                {notification.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
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
                <div className="control">
                  <button className="button is-primary is-fullwidth" type="submit">Login</button>
                </div>
              </div>

              <div className="has-text-centered">
                <p>Don't have an account? <a href="/signup">Sign up here</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;

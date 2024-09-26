function Login() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title has-text-centered">Login</h1>

            <form>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input className="input" type="email" placeholder="e.g. alex@example.com" />
                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" placeholder="********" />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button className="button is-primary is-fullwidth">Login</button>
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

function Signup() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third">
              <h1 className="title has-text-centered">Sign Up</h1>
  
              <form>
                <div className="field">
                  <label className="label">Username</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="Enter your username" />
                  </div>
                </div>
  
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
                  <label className="label">Confirm Password</label>
                  <div className="control">
                    <input className="input" type="password" placeholder="********" />
                  </div>
                </div>
  
                <div className="field">
                  <div className="control">
                    <button className="button is-primary is-fullwidth">Sign Up</button>
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
  